import { useState, useRef } from "react";
import { Alert, Image, StyleSheet } from "react-native";
import { Text, View, Button, Input, YStack, useTheme } from "tamagui";
import { router, Link } from "expo-router";
import { loginUser } from "../services/api";
import { useAuthContext } from "../contexts/AuthContext";
import { Welcome } from "components/icons";

const LoginScreen = () => {
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
      const response = await loginUser({ username, password });

      if (response.success) {
        console.log(response.data.data);
        await login(
          response.data.data.accessRefreshToken.access.token,
          response.data.data.accessRefreshToken.refresh.token,
          response.data.data.userInfo.username
        );

        Alert.alert(
          "성공",
          `${response.data.data.userInfo.username} 로그인 성공하셨습니다`
        );
      }
    } catch (error) {
      const errorMessage = error.message || "알 수 없는 오류가 발생했습니다.";
      Alert.alert("오류", errorMessage);
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
};

export default LoginScreen;

const styles = StyleSheet.create({
  image: {
    height: 300,
  },
  loginText: {
    fontWeight: 600,
  },
});
