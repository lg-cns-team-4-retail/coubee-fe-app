import React from "react";
import { YStack, XStack, Button, Text, View } from "tamagui";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomHeader = ({ title, onBackPress }) => {
  const router = useRouter();
  const { top } = useSafeAreaInsets(); // 상단 safe area 높이를 가져옴

  const handleBack = onBackPress || (() => router.back());

  return (
    <YStack
      backgroundColor="$primary"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
    >
      <XStack
        height={50} // 헤더의 높이
        alignItems="center"
        justifyContent="space-between"
        paddingHorizontal="$2"
      >
        <Button
          icon={<ChevronLeft size={28} />}
          onPress={handleBack}
          chromeless
          circular
        />
        <Text fontSize="$2" fontWeight="bold" flex={1} textAlign="center">
          {title}
        </Text>
        <View width={40} />
      </XStack>
    </YStack>
  );
};

export default CustomHeader;
