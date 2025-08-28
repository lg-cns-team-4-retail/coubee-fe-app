import React from "react";
import { TouchableOpacity, Linking, Alert, StyleSheet } from "react-native";
import { Phone } from "@tamagui/lucide-icons";
import { YStack, XStack, Text, Image, Button, Paragraph } from "tamagui";

const PhoneLink = ({ phoneNumber, style }) => {
  // 전화 걸기 함수
  const handlePress = async () => {
    const url = `tel:${phoneNumber}`;

    const canOpen = await Linking.canOpenURL(url);

    if (canOpen) {
      await Linking.openURL(url);
    } else {
      Alert.alert("오류", "이 기기에서는 전화를 걸 수 없습니다.");
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <XStack my="$2" gap="$2" ai="center">
        <Phone size={15} color="grey" />
        <Text style={[styles.linkText, style]}>{phoneNumber}</Text>
      </XStack>
    </TouchableOpacity>
  );
};

// 스타일 (선택 사항)
const styles = StyleSheet.create({
  linkText: {
    color: "#007AFF",
    textDecorationLine: "underline",
    fontSize: 16,
  },
});

export default PhoneLink;
