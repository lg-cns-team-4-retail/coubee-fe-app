import { useState, useRef } from "react";
import { Alert, StyleSheet, useWindowDimensions } from "react-native";
import { Text, Button, Input, YStack } from "tamagui";
import { router } from "expo-router";
import { Welcome } from "components/icons";

// 이 컴포넌트는 사실상 회원가입 화면이므로 이름을 그에 맞게 변경하는 것이 좋습니다.
function RegisterScreen() {
  // 1. 모든 입력 값을 하나의 상태 객체에서 관리합니다.
  const [formData, setFormData] = useState({
    username: "",
    nickname: "",
    password: "",
    role: "USER",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowDimensions();

  // 2. 각 입력창의 포커스 이동을 위해 Ref를 생성합니다.
  const nicknameInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // 3. React Native 방식의 범용 핸들러 함수입니다.
  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    const { username, password, nickname } = formData;

    if (!username || !password || !nickname) {
      Alert.alert("오류", "모든 정보를 입력해주세요.");
      return;
    }

    console.log("API 호출 직전, 전송될 데이터:", formData);

    setIsLoading(true);
    try {
      // 실제 회원가입 API 호출 (API 함수는 새로 만들어야 할 수 있습니다)
      // const response = await registerUser(formData);
      // if (response) { ... }
      Alert.alert("성공", "회원가입이 완료되었습니다. 로그인 해주세요.");
      router.push("/(auth)/login");
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("오류", "회원가입 중 문제가 발생했습니다.");
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
      bg="$background"
    >
      <Text style={styles.loginText} color="$color10">
        필요한 정보만 채우면
      </Text>
      <Text style={styles.loginText} color="$color10">
        쿠비가 당신을 도울거에요
      </Text>

      <Input
        width="100%"
        placeholder="ID"
        value={formData.username}
        onChangeText={(text) => handleChange("username", text)}
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => nicknameInputRef.current?.focus()}
      />

      <Input
        ref={nicknameInputRef}
        width="100%"
        placeholder="닉네임"
        value={formData.nickname}
        onChangeText={(text) => handleChange("nickname", text)}
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => passwordInputRef.current?.focus()}
      />

      <Input
        ref={passwordInputRef}
        width="100%"
        placeholder="PW"
        value={formData.password}
        onChangeText={(text) => handleChange("password", text)}
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={handleRegister}
      />

      <Button
        theme="active"
        width="100%"
        color="#fff"
        backgroundColor="$primary"
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? "회원가입 중..." : "회원가입"}
      </Button>

      <Button
        fontWeight={700}
        onPress={() => router.push("/(auth)/login")}
        chromeless
        size="$2"
      >
        로그인
      </Button>

      <Welcome />
    </YStack>
  );
}

export default RegisterScreen;

const styles = StyleSheet.create({
  loginText: {
    fontWeight: "600",
    fontSize: 18,
  },
});
