import React, { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { YStack } from "tamagui";
import { CoubeeSvgClick } from "./icons";

/**
 * 새로고침 시 꿀벌이 날아가는 애니메이션을 보여주는 컴포넌트이옵니다.
 * @param {boolean} isRefreshing - 새로고침 중인지 여부
 */
const CoubeeRefreshAnimation = ({ isRefreshing }) => {
  const { width } = useWindowDimensions();
  const progress = useSharedValue(0); // 애니메이션 진행 상태 (0 -> 1)

  useEffect(() => {
    // isRefreshing 상태에 따라 애니메이션을 시작하거나 리셋합니다.
    if (isRefreshing) {
      progress.value = withTiming(1, {
        duration: 1500, // 1.5초 동안 날아갑니다.
        easing: Easing.bezier(0.42, 0, 0.58, 1),
      });
    } else {
      progress.value = 0; // 새로고침이 끝나면 즉시 초기 위치로
    }
  }, [isRefreshing]);

  // 애니메이션 스타일 정의
  const animatedStyle = useAnimatedStyle(() => {
    // 1. 좌우 움직임: 화면 왼쪽 밖(-50)에서 오른쪽 밖(width + 50)으로 이동
    const translateX = interpolate(progress.value, [0, 1], [-50, width + 50]);

    // 2. 상하 움직임 (꿀벌처럼 위아래로 흔들리며 날아가는 효과)
    const translateY =
      interpolate(progress.value, [0, 0.25, 0.5, 0.75, 1], [0, -15, 0, 15, 0]) *
      -1;

    // 3. 회전 (진행 방향에 따라 약간 기울어지는 효과)
    const rotateZ = interpolate(progress.value, [0, 0.5, 1], [-10, 0, 10]);

    return {
      transform: [{ translateX }, { translateY }, { rotateZ: `${rotateZ}deg` }],
      // 애니메이션이 진행 중일 때만 보이도록 설정
      opacity: isRefreshing ? 1 : 0,
    };
  });

  return (
    <YStack
      position="absolute"
      top={20} // OrderStatusTracker 상단 근처에 위치
      left={0}
      right={0}
      zIndex={10} // 다른 요소들 위에 보이도록 설정
    >
      <Animated.View style={animatedStyle}>
        <CoubeeSvgClick width={40} height={40} />
      </Animated.View>
    </YStack>
  );
};

export default CoubeeRefreshAnimation;
