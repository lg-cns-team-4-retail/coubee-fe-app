import React, { createContext, useContext, useEffect } from "react";
import { router, useSegments } from "expo-router";
import { useAuth, type AuthState } from "../hooks/useAuth";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/modalSlice";

interface AuthContextType extends AuthState {
  login: (
    token: string,
    refreshToken?: string,
    userId?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const dispatch = useDispatch();
  const segments = useSegments();
  const publicRoutes = ["index", "(tabs)", "(auth)"];

  const protectedRoutes = ["orderDetail", "checkout"];

  // 현재 경로가 보호된 경로인지 확인
  const isProtectedRoute = (segments: string[]) => {
    if (!segments.length) return false;

    const firstSegment = segments[0];
    return protectedRoutes.includes(firstSegment);
  };

  const isPublicRoute = (segments: string[]) => {
    if (!segments.length) return true;

    const firstSegment = segments[0];
    return publicRoutes.includes(firstSegment);
  };

  useEffect(() => {
    if (auth.isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";

    if (auth.isAuthenticated) {
      if (inAuthGroup) {
        router.replace("/(tabs)");
      }
    } else {
      if (isProtectedRoute(segments)) {
        dispatch(
          openModal({
            type: "warning",
            title: "로그인이 필요합니다",
            message: "이 페이지에 접근하려면 먼저 로그인해주세요.",
            confirmText: "로그인하기",
            onConfirm: () => {
              router.replace("/login");
            },
            onCancel: () => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/(tabs)");
              }
            },
            cancelText: "다음에 할게요",
          })
        );
      }
    }
  }, [auth.isAuthenticated, auth.isLoading, segments]);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

// Default export for Expo Router compatibility
export default AuthProvider;
