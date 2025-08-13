import { useState, useRef } from "react";
import { Alert, Image, StyleSheet } from "react-native";
import { Text, View, Button, Input, YStack, useTheme } from "tamagui";
import { router, Link } from "expo-router";
import { loginUser } from "../services/api";
import { useAuthContext } from "../contexts/AuthContext";
import { Welcome } from "components/icons";

function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthContext();
  const passwordInputRef = useRef(null);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("오류", "사용자명과 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    console.log(username, password);
    try {
      // 실제 로그인 API 호출
      const response = await loginUser({ username, password });
      console.log(response);
      if (response) {
        // AuthContext의 login 함수를 통해 상태 업데이트
        await login(
          response.data.accessRefreshToken.access.token,
          response.data.accessRefreshToken.refresh.token,
          response.data.userInfo.username
        );

        Alert.alert("성공", "로그인이 완료되었습니다.");
        // AuthContext에서 자동으로 라우팅을 처리함
      } else {
        Alert.alert("오류", "사용자명 또는 비밀번호가 올바르지 않습니다.");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <YStack
      flex={1}
      justifyContent="center"
      alignItems="center"
      gap="$4"
      px="$10"
      pt="$2"
      bg="$secondary"
    >
      <Text style={styles.loginText} color="$infoText">
        당신을 위한
      </Text>
      <Text style={styles.loginText} color="$infoText">
        {" "}
        오프라인 도우미 - 쿠비
      </Text>
      <Input
        width="100%"
        placeholder="ID"
        backgroundColor={"#ffff"}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => {
          passwordInputRef.current?.focus();
        }}
      />

      <Input
        ref={passwordInputRef}
        width="100%"
        placeholder="PW"
        backgroundColor={"#ffff"}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={handleLogin}
      />
      <Button
        backgroundColor="$primary"
        color="#fff"
        width="100%"
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? "로그인 중..." : "로그인"}
      </Button>
      <Button
        onPress={() => router.push("/register")}
        color="#808080"
        fontWeight={700}
        chromeless
        size="$2"
      >
        회원가입
      </Button>
      <Welcome />
    </YStack>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  image: {
    height: 300,
  },
  loginText: {
    fontWeight: 600,
  },
});
