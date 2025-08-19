import React from "react";
import {
  Text,
  TouchableOpacity,
  Linking,
  Alert,
  StyleSheet,
} from "react-native";

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
      <Text style={[styles.linkText, style]}>전화번호: {phoneNumber}</Text>
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
