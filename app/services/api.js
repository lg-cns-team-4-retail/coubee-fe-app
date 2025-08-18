import axios from "axios";
import { AuthService } from "./auth";
import { config } from "../config/env";

const API_BASE_URL = config.apiBaseUrl;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AuthService.getToken();
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
  (response) => response, // 성공 응답은 그대로 통과
  async (error) => {
    const { config: originalRequest, response } = error;

    // 401 오류이고, 아직 재시도 안했을 때
    if (response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // 이미 토큰 갱신이 진행 중이면, 갱신이 끝날 때까지 요청을 대기시킵니다.
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
        if (!refreshToken) {
          await handleTokenExpiredLogout();
          return Promise.reject(error);
        }

        // 새 토큰 발급 요청
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/user/auth/refresh`,
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          }
        );

        const newAccessToken = refreshResponse.data.data.access.token;
        await AuthService.setToken(newAccessToken);

        isRefreshing = false;
        onRefreshed(newAccessToken); // 대기 중이던 다른 요청들을 실행시킵니다.

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest); // 원래 요청을 새 토큰으로 재시도합니다.
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

// --- 토큰 만료로 인한 자동 로그아웃 처리 ---
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

export default axiosInstance;
