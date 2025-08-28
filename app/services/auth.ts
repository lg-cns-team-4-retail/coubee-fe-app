import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "userToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_ID_KEY = "userId";
const PUSH_TOKEN_KEY = "pushToken";
const ACCESS_TOKEN_EXPIRATION_KEY = "accessTokenExpiration";

export class AuthService {
  // JWT 토큰 저장
  static async setToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch (error) {
      console.error("Error saving token:", error);
      throw error;
    }
  }

  // JWT 토큰 조회
  static async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error("Error retrieving token:", error);
      return null;
    }
  }

  // Refresh Token 저장
  static async setRefreshToken(token: string): Promise<void> {
    console.log(token, " saving token for refresh service");
    try {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error("Error saving refresh token:", error);
      throw error;
    }
  }

  // Refresh Token 조회
  static async getRefreshToken(): Promise<string | null> {
    try {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      console.log(refreshToken, "auth service");
      return refreshToken;
    } catch (error) {
      console.error("Error retrieving refresh token:", error);
      return null;
    }
  }

  // 사용자 ID 저장
  static async setUserId(userId: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(USER_ID_KEY, userId);
    } catch (error) {
      console.error("Error saving user ID:", error);
      throw error;
    }
  }

  // 사용자 ID 조회
  static async getUserId(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(USER_ID_KEY);
    } catch (error) {
      console.error("Error retrieving user ID:", error);
      return null;
    }
  }

  // Push Token 저장
  static async setPushToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(PUSH_TOKEN_KEY, token);
    } catch (error) {
      console.error("Error saving push token:", error);
      throw error;
    }
  }

  // Push Token 조회
  static async getPushToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(PUSH_TOKEN_KEY);
    } catch (error) {
      console.error("Error retrieving push token:", error);
      return null;
    }
  }

  // JWT 토큰 삭제
  static async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error("Error removing token:", error);
    }
  }

  // JWT 만료 시간 확인
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const now = Date.now() / 1000;
      return payload.exp < now;
    } catch (error) {
      console.error("Error parsing token:", error);
      return true; // 파싱 실패시 만료된 것으로 간주
    }
  }

  // 토큰 유효성 검사
  static async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();

      if (!token) {
        return false;
      }

      // 토큰이 만료되었는지 확인
      if (this.isTokenExpired(token)) {
        await this.removeToken(); // 만료된 토큰 삭제
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  }

  static async setAccessTokenExpiration(expiresIn: number): Promise<void> {
    try {
      // 현재 시간에 만료 기간(초)을 더해 만료될 정확한 타임스탬프(ms)를 계산
      const expirationTime = Date.now() + expiresIn * 1000;
      await SecureStore.setItemAsync(
        ACCESS_TOKEN_EXPIRATION_KEY,
        String(expirationTime) // SecureStore에는 문자열로 저장
      );
    } catch (error) {
      console.error("Error saving access token expiration:", error);
    }
  }

  // ❗ 새로운 메서드 추가: 만료 시간 조회
  static async getAccessTokenExpiration(): Promise<number | null> {
    try {
      const expirationTime = await SecureStore.getItemAsync(
        ACCESS_TOKEN_EXPIRATION_KEY
      );
      return expirationTime ? parseInt(expirationTime, 10) : null;
    } catch (error) {
      console.error("Error retrieving access token expiration:", error);
      return null;
    }
  }

  // ❗ 수정된 메서드: clearAll
  static async clearAll(): Promise<void> {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_ID_KEY),
        SecureStore.deleteItemAsync(PUSH_TOKEN_KEY),
        SecureStore.deleteItemAsync(ACCESS_TOKEN_EXPIRATION_KEY),
      ]);
      console.log("All auth data cleared");
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  }

  static async login(
    token: string,
    expiresIn: number, // expiresIn 파라미터 추가
    refreshToken?: string,
    userId?: string
  ): Promise<void> {
    try {
      await this.setToken(token);
      // ❗ 만료 시간 저장 로직 추가r
      await this.setAccessTokenExpiration(expiresIn);
      if (refreshToken) {
        await this.setRefreshToken(refreshToken);
      }
      if (userId) {
        await this.setUserId(userId);
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }
}

// Default export for Expo Router compatibility
export default AuthService;
