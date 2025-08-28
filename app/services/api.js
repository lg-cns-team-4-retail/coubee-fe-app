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

async function refreshAccessToken() {
  if (isRefreshing) {
    return new Promise((resolve) => {
      addRefreshSubscriber((token) => resolve(token));
    });
  }

  isRefreshing = true;

  try {
    const refreshToken = await AuthService.getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token available");

    console.log("[선제적 갱신] 리프레시 토큰으로 새 Access Token 요청");
    const response = await axios.post(`${API_BASE_URL}/user/auth/refresh`, {
      token: refreshToken,
    });

    const { access } = response.data.data;
    await AuthService.login(access.token, access.expiresIn, refreshToken);

    console.log("[선제적 갱신] 새 Access Token 저장 완료");
    isRefreshing = false;
    onRefreshed(access.token);
    return access.token;
  } catch (error) {
    console.error("선제적 토큰 갱신 실패. 로그아웃 합니다.", error);
    isRefreshing = false;
    onRefreshed(null);
    await handleTokenExpiredLogout();
    return Promise.reject(error);
  }
}

axiosInstance.interceptors.request.use(
  async (config) => {
    // '/user/auth/refresh' 요청은 인터셉트하지 않도록 예외 처리
    if (config.url.includes("/user/auth/refresh")) {
      return config;
    }

    const token = await AuthService.getToken();
    const expirationTime = await AuthService.getAccessTokenExpiration();

    if (token && expirationTime) {
      const buffer = 60 * 1000;

      if (Date.now() > expirationTime - buffer) {
        console.log(
          "[요청 전 확인] Access Token 만료 임박, 선제적 갱신을 시작합니다."
        );
        const newAccessToken = await refreshAccessToken();
        config.headers.Authorization = `Bearer ${newAccessToken}`;
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config: originalRequest, response } = error;
    if (response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.log(
        "[401 Fallback] 예외적인 401 오류 발생! 토큰 갱신을 재시도합니다."
      );
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
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
    const { userInfo, accessRefreshToken } = response.data.data;
    await AuthService.login(
      accessRefreshToken.access.token,
      accessRefreshToken.access.expiresIn,
      accessRefreshToken.refresh.token,
      String(userInfo.userId)
    );
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
