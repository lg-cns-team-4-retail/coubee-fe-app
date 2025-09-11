// components/ModernHotdealBanner.jsx

import React, { useEffect } from "react";
import { YStack, Text, Card } from "tamagui";
import { Flame } from "@tamagui/lucide-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from "react-native-reanimated";

// 숫자 포맷팅을 위한 헬퍼 함수 (예: 5000 -> 5,000)
const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "0";
  return new Intl.NumberFormat("ko-KR").format(amount);
};

const ModernHotdealBanner = ({ hotdeal }) => {
  const animation = useSharedValue(0);

  useEffect(() => {
    // 2초 주기로 반복되는 부드러운 애니메이션
    animation.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1, // 무한 반복
      true // 자동으로 되돌아가기
    );
  }, [animation]);

  const animatedStyle = useAnimatedStyle(() => {
    // 크기와 그림자를 미세하게 조절하여 은은한 효과 부여
    const scale = interpolate(animation.value, [0, 1], [1, 1.02]);
    const shadowOpacity = interpolate(animation.value, [0, 1], [0.1, 0.2]);

    return {
      transform: [{ scale }],
      shadowOpacity,
    };
  });

  // 핫딜 정보가 없거나 비활성 상태일 경우 렌더링하지 않음
  if (!hotdeal || hotdeal.hotdealStatus !== "ACTIVE") {
    return null;
  }

  const salePercentage = hotdeal.saleRate * 100;
  const maxDiscountFormatted = formatCurrency(hotdeal.maxDiscount);

  return (
    <Card
      flexDirection="row"
      alignItems="center"
      paddingVertical="$3"
      paddingHorizontal="$4"
      borderRadius="$5"
      color="white"
      bg="$error"
      gap="$4"
      bordered
      borderColor="$borderColor"
    >
      {/* 아이콘 영역 */}
      <Flame color="white" size={32} fill="white" />

      {/* 텍스트 영역 */}
      <YStack f={1}>
        <Text fontSize="$3" fontWeight="bold" color="white">
          핫딜
        </Text>
        <Text fontSize="$4" color="white">
          {salePercentage}% 할인 (최대 {maxDiscountFormatted}원)
        </Text>
      </YStack>
    </Card>
  );
};

export default ModernHotdealBanner;
