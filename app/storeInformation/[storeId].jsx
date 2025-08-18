import React from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
} from "react-native-reanimated";
import { ChevronLeft, MapPin, Clock, Info } from "@tamagui/lucide-icons";
import {
  useTheme,
  Button,
  XStack,
  YStack,
  Text,
  useThemeName,
  Separator,
} from "tamagui";
import { router } from "expo-router";
import backgroundSrc from "../../assets/images/background.jpg"; // 배경 이미지 경로
import profileSrc from "../../assets/images/peach.png"; // 프로필 이미지 경로 (새로 추가 필요)

// --- 설정 값 ---
const HEADER_IMAGE_HEIGHT = 250;
const ANIMATION_START_Y = HEADER_IMAGE_HEIGHT * 0.5;
const ANIMATION_END_Y = HEADER_IMAGE_HEIGHT * 0.8;

// 아이콘을 겹쳐놓고 투명도를 조절하기 위한 래퍼 컴포넌트
const CrossfadingIcon = ({
  WhiteIcon,
  BlackIcon,
  size,
  whiteIconStyle,
  blackIconStyle,
}) => {
  return (
    <Button
      unstyled
      chromeless
      size="$2"
      onPress={() => {
        router.back();
      }}
      // 아이콘 버튼의 터치 영역을 확보하기 위해 패딩 추가
      padding="$2"
    >
      <Animated.View style={[StyleSheet.absoluteFill, whiteIconStyle]}>
        <WhiteIcon size={size} color="#FFFFFF" />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, blackIconStyle]}>
        <BlackIcon size={size} color="#000000" />
      </Animated.View>
    </Button>
  );
};

// 정보 섹션 컴포넌트
const InfoSection = ({ title, children }) => (
  <YStack gap="$3" width="100%">
    <Text fontSize={18} fontWeight="bold" color="$color11">
      {title}
    </Text>
    <YStack
      backgroundColor="$cardBg"
      borderRadius="$6"
      padding="$4"
      gap="$2"
      // 그림자 효과 추가
      /*       shadowColor="#000"
      shadowOffset={{ width: 0, height: 1 }}
      shadowOpacity={0.05}
      shadowRadius={3}
      elevation={2} */
    >
      {children}
    </YStack>
  </YStack>
);

export default function StoreInformationPage() {
  const scrollY = useSharedValue(0);
  const theme = useTheme();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollY.value,
      [ANIMATION_START_Y, ANIMATION_END_Y],
      ["rgba(255, 255, 255, 0)", theme.background.val]
    );
    return { backgroundColor };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [ANIMATION_START_Y, ANIMATION_END_Y],
      [0, 1],
      "clamp"
    );
    return { opacity };
  });

  const whiteIconAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [ANIMATION_START_Y, ANIMATION_END_Y],
        [1, 0],
        "clamp"
      ),
    };
  });

  const blackIconAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollY.value,
        [ANIMATION_START_Y, ANIMATION_END_Y],
        [0, 1],
        "clamp"
      ),
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle={"light-content"} />

      {/* 스크롤 시 상단에 고정되는 헤더 */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <SafeAreaView>
          <XStack
            alignItems="center"
            justifyContent="space-between"
            paddingHorizontal="$4"
            height={50}
          >
            <CrossfadingIcon
              WhiteIcon={ChevronLeft}
              BlackIcon={ChevronLeft}
              size={28}
              whiteIconStyle={whiteIconAnimatedStyle}
              blackIconStyle={blackIconAnimatedStyle}
            />
            <Animated.View
              style={[styles.headerTitleContainer, titleAnimatedStyle]}
            >
              <Text style={styles.headerTitle}>장씨네 과일가게</Text>
            </Animated.View>
            <View style={{ width: 28 }} />
          </XStack>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* 배경 이미지 */}
        <Image source={backgroundSrc} style={styles.headerImage} />

        {/* 메인 콘텐츠 영역 */}
        <YStack backgroundColor="$background" style={styles.content}>
          {/* 프로필 이미지 */}
          <Image source={profileSrc} style={styles.profileImage} />
          <YStack alignItems="center" gap="$1.5">
            <Text fontSize={28} fontWeight="bold">
              장씨네 과일가게
            </Text>
          </YStack>
          <YStack alignItems="center" gap="$4" px="$4">
            {/* 가게 이름 및 설명 */}

            {/* 태그 */}
            <XStack gap="$2" mt="$2">
              <Button
                backgroundColor="$primary"
                fontWeight="700"
                color="#fff"
                size="$2"
                theme="alt1"
                borderRadius="$10"
              >
                최고 당도 보장
              </Button>
              <Button
                backgroundColor="$primary"
                fontWeight="700"
                color="#fff"
                size="$2"
                theme="alt1"
                borderRadius="$10"
              >
                과일가게
              </Button>
              <Button
                backgroundColor="$primary"
                fontWeight="700"
                color="#fff"
                size="$2"
                theme="alt1"
                borderRadius="$10"
              >
                신뢰성
              </Button>
            </XStack>
          </YStack>

          <YStack gap="$6" px="$4" mt="$8">
            <InfoSection title="가게 소개">
              <Text lineHeight={22}>
                과일가게는 신선한 과일을 판매하는 곳입니다. 다양한 종류의 과일을
                취급하며, 계절에 따라 제철 과일을 판매하기도 합니다. 일반적으로
                과일가게는 도매시장에서 과일을 구매하여 소매로 판매하며, 일부
                과일가게는 직접 재배한 과일을 판매하기도 합니다.
              </Text>
            </InfoSection>

            <InfoSection title="가게 위치">
              <Text>[04620] 서울특별시 중구 필동로 1길 30</Text>
            </InfoSection>

            <InfoSection title="영업 시간">
              <Text>
                평일: 오전 9:00 ~ 오후 9:00 (사정상 조기 종료할수있음)
              </Text>
              <Text>주말: 오전 11:00 ~ 오후 8:00</Text>
            </InfoSection>

            <InfoSection title="사업자 정보">
              <Text>사업주: 장승원</Text>
              <Text>사업자번호: 123456708</Text>
              <Text>전화번호: 010-1234-5678</Text>
            </InfoSection>
          </YStack>
        </YStack>
      </Animated.ScrollView>
    </View>
  );
}

// --- 스타일 정의 ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0", // 배경색을 이미지와 유사하게 변경
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  headerTitleContainer: {
    position: "absolute",
    left: 60,
    right: 60,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  headerImage: {
    width: "100%",
    height: HEADER_IMAGE_HEIGHT,
    opacity: 0.3,
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    alignSelf: "center",
    marginBottom: 20,
    marginTop: -70,
  },
  content: {
    borderRadius: 18,
    marginTop: -20,
    padding: 16,
  },
});
