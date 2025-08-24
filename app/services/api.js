import axios from "axios";
import { AuthService } from "./auth";
import { config } from "../config/env";
import { decode as atob } from "base-64"; // JWT 토큰 해석을 위해 'base-64' 라이브러리 import

const API_BASE_URL = config.apiBaseUrl;

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWT 파싱 오류:", e);
    return null;
  }
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AuthService.getToken();
    console.log("token using", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- 토큰 갱신 중복 방지 전략 ---
let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (token) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = []; // 초기화
};

const addRefreshSubscriber = (cb) => {
  refreshSubscribers.push(cb);
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config: originalRequest, response } = error;

    if (response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 📜 --- 첩보 1: 어떤 요청이 401 오류를 발생시켰는가? ---
      console.log(`[토큰 갱신 시작] 401 오류 발생!`);
      console.log(
        `- 실패한 요청: ${originalRequest.method.toUpperCase()} ${
          originalRequest.url
        }`
      );

      if (isRefreshing) {
        return new Promise((resolve) => {
          addRefreshSubscriber((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = await AuthService.getRefreshToken();

        // 📜 --- 첩보 2: 리프레시 토큰이 유효한가? ---
        console.log(
          `[토큰 갱신 중] 저장된 리프레시 토큰:`,
          refreshToken ? `${refreshToken.substring(0, 15)}...` : "없음"
        );

        if (!refreshToken) {
          await handleTokenExpiredLogout();
          return Promise.reject(error);
        }

        const refreshResponse = await axios.post(
          `${API_BASE_URL}/user/auth/refresh`,
          { token: refreshToken }
        );

        const newAccessToken = refreshResponse.data.data.access.token;

        // 📜 --- 첩보 3: 새로 발급받은 토큰은 무엇인가? ---
        console.log(
          `[토큰 갱신 중] 새로 발급받은 Access Token:`,
          `${newAccessToken.substring(0, 15)}...`
        );

        // 📜 --- 첩보 4 (핵심): 새 토큰의 내용물(payload)은 무엇인가? userId가 있는가? ---
        const decodedToken = parseJwt(newAccessToken);
        console.log(
          `[토큰 갱신 중] ❗새 토큰 해독 결과 (Payload):`,
          decodedToken
        );
        if (decodedToken) {
          console.log(
            `[토큰 갱신 중] ❗새 토큰에 포함된 userId:`,
            decodedToken.userId || decodedToken.sub || "userId 필드 없음"
          );
        }

        await AuthService.setToken(newAccessToken);

        isRefreshing = false;
        onRefreshed(newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 📜 --- 첩보 5: 새 토큰으로 이전 요청을 다시 시도하는가? ---
        console.log(
          `[토큰 갱신 완료] 이전 요청 재시도: ${originalRequest.url}`
        );
        console.log(`- 재시도 요청 헤더:`, originalRequest.headers);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed, logging out...", refreshError);
        isRefreshing = false;
        onRefreshed(null);
        await handleTokenExpiredLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

async function handleTokenExpiredLogout() {
  try {
    const pushToken = await AuthService.getPushToken();
    if (pushToken) {
      await deleteTokenFromBackend(pushToken);
    }
    await AuthService.clearAll();
    // AuthContext에서 자동으로 로그인 화면으로 리다이렉트됩니다.
    console.log("Automatic logout completed due to token expiration.");
  } catch (error) {
    console.error("Error during automatic logout:", error);
  }
}

/**
 * 로그인 API
 * @param {object} credentials - { username, password }
 * @returns {Promise<object|null>}
 */
export async function loginUser(credentials) {
  try {
    const response = await axiosInstance.post("/user/auth/login", credentials);
    console.log(response.data);
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "로그인 중 문제가 발생했습니다.";
    console.error("Login request failed:", errorMessage);
    return { success: false, message: errorMessage };
  }
}

/**
 * 회원가입 API
 * @param {object} formData - { username, nickname, password, role }
 * @returns {Promise<object|null>}
 */
export async function registerUser(formData) {
  try {
    const response = await axiosInstance.post("/user/auth/signup", formData);
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || "회원가입 중 문제가 발생했습니다.";
    console.error("Registration request failed:", errorMessage);
    return { success: false, message: errorMessage };
  }
}

/**
 * 푸시 토큰을 백엔드 서버로 전송
 * @param {string} token - Expo 푸시 토큰
 * @returns {Promise<boolean>} 성공 여부
 */
export async function sendTokenToBackend(token) {
  try {
    await axiosInstance.post("/user/notification/token", {
      notificationToken: token,
    });
    console.log("Push token sent successfully");
    return true;
  } catch (error) {
    console.error(
      "Error sending push token:",
      error.response?.data || error.message
    );
    return false;
  }
}

/**
 * 푸시 토큰 삭제 (로그아웃 시)
 * @param {string} token - Expo 푸시 토큰
 * @returns {Promise<boolean>} 성공 여부
 */
export async function deleteTokenFromBackend(token) {
  try {
    await axiosInstance.post(`/user/notification/token/delete`, {
      notificationToken: token,
    });
    console.log("Push token deleted successfully");
    return true;
  } catch (error) {
    console.error(
      "Error deleting push token:",
      error.response?.data || error.message
    );
    return false;
  }
}

/**
 * 사용자 로그아웃 처리 (수동)
 */
export async function handleUserLogout() {
  try {
    const pushToken = await AuthService.getPushToken();
    if (pushToken) {
      await deleteTokenFromBackend(pushToken);
    }
    await AuthService.clearAll();
    console.log("Manual logout completed");
  } catch (error) {
    console.error("Error during manual logout:", error);
    throw error;
  }
}

export const paymentAPI = {
  /**
   * 결제 설정 정보 조회
   * @returns {Promise<object>}
   */
  getPaymentConfig: async () => {
    try {
      const response = await axiosInstance.get("/order/payment/config");
      return response.data; // { success: true, data: response.data } 대신 실제 데이터만 반환하도록 수정
    } catch (error) {
      console.error(
        "Payment config fetch failed:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message ||
          "결제 설정 정보를 가져오는데 실패했습니다."
      );
    }
  },

  /**
   * 새로운 주문 생성
   * @param {object} orderData - 주문 데이터
   * @returns {Promise<object>}
   */
  createOrder: async (orderData) => {
    try {
      const response = await axiosInstance.post("/order/orders", orderData);
      return response.data;
    } catch (error) {
      console.error(
        "Order creation failed:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "주문 생성에 실패했습니다."
      );
    }
  },

  /**
   * 결제 준비
   * @param {string} orderId - 주문 ID
   * @param {object} prepareData - 결제 준비 데이터
   * @returns {Promise<object>}
   */
  preparePayment: async (orderId, prepareData) => {
    try {
      // API 경로 수정: 원본 코드의 '/api' 접두사 제외
      const response = await axiosInstance.post(
        `/order/payment/orders/${orderId}/prepare`,
        prepareData
      );
      return response.data;
    } catch (error) {
      console.error(
        "Payment preparation failed:",
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.message || "결제 준비에 실패했습니다."
      );
    }
  },
};

export default axiosInstance;
