import { useState, useEffect } from "react";
import { AuthService } from "../services/auth";
import { useDispatch } from "react-redux"; // 👈 1. useDispatch import
import { apiSlice } from "../../redux/api/apiSlice"; // 👈 2. apiSlice import
import { router } from "expo-router";

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string | null;
  nickname: string | null;
}

export function useAuth() {
  const dispatch = useDispatch();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userId: null,
    nickname: null,
  });

  const checkAuthStatus = async () => {
    try {
      const [isAuthenticated, userId, nickname] = await Promise.all([
        AuthService.isAuthenticated(),
        AuthService.getUserId(),
        AuthService.getNickname(),
      ]);

      setAuthState({
        isAuthenticated,
        isLoading: false,
        userId,
        nickname,
      });
    } catch (error) {
      console.error("Error checking auth status:", error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        userId: null,
        nickname: null,
      });
    }
  };

  const login = async (
    token: string,
    expiresIn: number,
    refreshToken?: string,
    userId?: string,
    nickname?: string
  ) => {
    try {
      await AuthService.login(token, expiresIn, refreshToken, userId, nickname);

      // 로그인 성공 후 푸시 토큰 등록 및 로컬 저장
      await registerAndStorePushToken(userId);

      await checkAuthStatus();
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  // 로그인 후 푸시 토큰 등록 및 로컬 저장
  const registerAndStorePushToken = async (userId?: string) => {
    try {
      const { getExpoPushToken } = await import("../services/notifications");
      const { sendTokenToBackend } = await import("../services/api");

      // 푸시 토큰 가져오기
      const pushToken = await getExpoPushToken();
      if (!pushToken) {
        console.log("No push token available");
        return;
      }

      // 기존에 저장된 푸시 토큰과 비교 (저장 전에)
      const storedPushToken = await AuthService.getPushToken();

      // 로컬에 푸시 토큰 저장 (항상 저장)
      await AuthService.setPushToken(pushToken);
      console.log("Push token saved locally");
      const success = await sendTokenToBackend(pushToken);
      // 서버에 전송: 새 토큰이거나 처음 로그인하는 경우
      if (userId && (storedPushToken !== pushToken || !storedPushToken)) {
        // 토큰이 완전히 저장될 때까지 잠시 대기
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const success = await sendTokenToBackend(pushToken);
        if (success) {
          console.log("Push token registered on server");
        } else {
          console.log("Push token registration failed (but saved locally)");
        }
      } else if (userId) {
        console.log("Push token already up to date on server");
      } else {
        console.log("No userId provided, skipping server registration");
      }
    } catch (error) {
      console.error("Error handling push token:", error);
      // 푸시 토큰 실패가 로그인을 방해하지 않도록 에러를 던지지 않음
    }
  };

  const logout = async () => {
    try {
      const pushToken = await AuthService.getPushToken();
      if (pushToken) {
        const { deleteTokenFromBackend } = await import("../services/api");
        await deleteTokenFromBackend(pushToken);
      }

      await AuthService.clearAll();
      dispatch(apiSlice.util.resetApiState());
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        userId: null,
        nickname: null,
      });
      router.push("/(tabs)");
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return {
    ...authState,
    login,
    logout,
    checkAuthStatus,
  };
}

// Default export for Expo Router compatibility
export default useAuth;
