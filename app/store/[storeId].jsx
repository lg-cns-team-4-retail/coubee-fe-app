import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
} from "react-native-reanimated";
import {
  ChevronLeft,
  Search,
  ShoppingCart,
  Share,
} from "@tamagui/lucide-icons";

// --- 설정 값 ---
const HEADER_IMAGE_HEIGHT = 250;
const ANIMATION_START_Y = HEADER_IMAGE_HEIGHT * 0.5;
const ANIMATION_END_Y = HEADER_IMAGE_HEIGHT * 0.8;

// 1. 아이콘을 겹쳐놓고 투명도를 조절하기 위한 래퍼 컴포넌트
// 이 컴포넌트는 흰색 아이콘과 검은색 아이콘을 받아 겹쳐놓고, 애니메이션 스타일에 따라 투명도를 조절합니다.
const CrossfadingIcon = ({
  WhiteIcon,
  BlackIcon,
  size,
  whiteIconStyle,
  blackIconStyle,
}) => {
  return (
    <View style={{ width: size, height: size }}>
      <Animated.View style={[StyleSheet.absoluteFill, whiteIconStyle]}>
        <WhiteIcon size={size} color="#FFFFFF" />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, blackIconStyle]}>
        <BlackIcon size={size} color="#000000" />
      </Animated.View>
    </View>
  );
};

export default function StoreDetailPage() {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // 헤더 배경색 애니메이션 스타일
  const headerAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollY.value,
      [ANIMATION_START_Y, ANIMATION_END_Y],
      ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 1)"]
    );
    return { backgroundColor };
  });

  // 헤더 제목 투명도 애니메이션 스타일
  const titleAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [ANIMATION_START_Y, ANIMATION_END_Y],
      [0, 1],
      "clamp"
    );
    return { opacity };
  });

  // 2. 흰색 아이콘의 투명도 스타일 (스크롤 시 1 -> 0 으로 사라짐)
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

  // 3. 검은색 아이콘의 투명도 스타일 (스크롤 시 0 -> 1 로 나타남)
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
      <StatusBar barStyle="dark-content" />

      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.headerContent}>
            {/* 4. CrossfadingIcon 컴포넌트를 사용하여 아이콘을 렌더링합니다. */}
            <CrossfadingIcon
              WhiteIcon={ChevronLeft}
              BlackIcon={ChevronLeft}
              size={28}
            />

            <Animated.Text style={[styles.headerTitle, titleAnimatedStyle]}>
              짬뽕매니아 신림점
            </Animated.Text>

            <View style={styles.headerIcons}>
              <CrossfadingIcon WhiteIcon={Share} BlackIcon={Share} size={24} />
              <CrossfadingIcon
                WhiteIcon={Search}
                BlackIcon={Search}
                size={24}
              />
              <CrossfadingIcon
                WhiteIcon={ShoppingCart}
                BlackIcon={ShoppingCart}
                size={24}
              />
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: HEADER_IMAGE_HEIGHT }}
      >
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1542654547-5349e3556f2d?q=80&w=2940",
          }}
          style={styles.headerImage}
        />

        <View style={styles.content}>
          <View style={styles.banner}>
            <Text style={styles.bannerText}>✨ 배민클럽 가입하면 무료배달</Text>
          </View>
          <Text style={styles.storeTitle}>짬뽕매니아 신림점</Text>
          <View style={styles.longContentPlaceholder} />
        </View>
      </Animated.ScrollView>
    </View>
  );
}

// --- 스타일 정의 ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    borderBottomWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 50,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    zIndex: -1,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 16,
  },
  headerImage: {
    width: "100%",
    height: HEADER_IMAGE_HEIGHT,
    position: "absolute",
    top: 0,
  },
  content: {
    padding: 16,
    backgroundColor: "#fff",
  },
  banner: {
    backgroundColor: "#E6F3FF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  bannerText: {
    color: "#0066FF",
    fontWeight: "bold",
  },
  storeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  longContentPlaceholder: {
    height: 1000,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
});
