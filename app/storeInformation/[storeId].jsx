import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
} from "react-native-reanimated";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { useTheme, Button, XStack, YStack, Text } from "tamagui";
import { router, useLocalSearchParams } from "expo-router";

import { useGetStoreDetailQuery } from "../../redux/api/apiSlice";

import backgroundSrc from "../../assets/images/background.jpg";
import profileSrc from "../../assets/images/peach.png";
import Skeleton from "../../components/Skeleton";
import StoreTags from "./StoreTag";
import StoreInfo from "./StoreInfo";

const HEADER_IMAGE_HEIGHT = 250;
const ANIMATION_START_Y = HEADER_IMAGE_HEIGHT * 0.5;
const ANIMATION_END_Y = HEADER_IMAGE_HEIGHT * 0.8;

const CrossfadingIcon = ({
  WhiteIcon,
  BlackIcon,
  size,
  whiteIconStyle,
  blackIconStyle,
}) => (
  <Button
    unstyled
    chromeless
    size="$2"
    onPress={() => router.back()}
    padding="$2"
  >
    <Animated.View style={[StyleSheet.absoluteFill, whiteIconStyle]}>
      <WhiteIcon size={size} color="#FFFFFF" />
    </Animated.View>
    <Animated.View style={[StyleSheet.absoluteFill, blackIconStyle]}>
      <BlackIcon size={size} color="#ffffff" />
    </Animated.View>
  </Button>
);

export default function StoreInformationPage() {
  const scrollY = useSharedValue(0);
  const theme = useTheme();

  const { storeId } = useLocalSearchParams();

  const {
    data: storeData, // API 응답 데이터
    isLoading, // 최초 로딩 상태
    isError, // 에러 발생 여부
  } = useGetStoreDetailQuery(storeId, {
    skip: !storeId,
  });

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

  const whiteIconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [ANIMATION_START_Y, ANIMATION_END_Y],
      [1, 0],
      "clamp"
    ),
  }));

  const blackIconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [ANIMATION_START_Y, ANIMATION_END_Y],
      [0, 1],
      "clamp"
    ),
  }));

  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" />
      </YStack>
    );
  }

  if (isError) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text>상점 정보를 불러오는 데 실패했습니다.</Text>
        <Button onPress={() => router.back()} marginTop="$4">
          뒤로가기
        </Button>
      </YStack>
    );
  }

  return (
    <YStack bg="$background" style={styles.container}>
      <StatusBar barStyle={"light-content"} />

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
              <Text style={styles.headerTitle}>{storeData?.storeName}</Text>
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
        <Image
          source={{ uri: storeData?.backImg }}
          style={styles.headerImage}
        />
        <YStack backgroundColor="$background" style={styles.content}>
          <Image
            source={{ uri: storeData?.profileImg }}
            style={styles.profileImage}
          />
          <YStack alignItems="center" gap="$1.5">
            <Skeleton show={isLoading} width={80}>
              <Text fontSize={28} fontWeight="bold">
                {storeData?.storeName}
              </Text>
            </Skeleton>
          </YStack>
          <YStack alignItems="center" gap="$4" px="$4">
            <StoreTags loading={isLoading} tags={storeData?.storeTag} />
          </YStack>
          <StoreInfo loading={isLoading} data={storeData} />
        </YStack>
      </Animated.ScrollView>
    </YStack>
  );
}

// 스타일 정의 (기존과 동일)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F0",
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
    color: "#fff",
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
