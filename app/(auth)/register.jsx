import { useState, useRef } from "react";
import { Alert, StyleSheet, useWindowDimensions } from "react-native";
import { Text, Button, Input, YStack } from "tamagui";
import { router } from "expo-router";
import { Welcome } from "components/icons";
import { registerUser } from "../services/api";

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    username: "",
    nickName: "",
    password: "",
    role: "USER",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowDimensions();

  const nicknameInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    const { username, password, nickName } = formData;

    if (!username || !password || !nickName) {
      console.log(nickName, username, password);
      Alert.alert("오류", "모든 정보를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await registerUser(formData);

      if (response.success) {
        Alert.alert("성공", "회원가입이 완료되었습니다.");
        router.push("/(auth)/login");
      } else {
        Alert.alert("오류", response.message);
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
        value={formData.nickName}
        onChangeText={(text) => handleChange("nickName", text)}
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
};

export default RegisterScreen;

const styles = StyleSheet.create({
  loginText: {
    fontWeight: "600",
    fontSize: 18,
  },
});
