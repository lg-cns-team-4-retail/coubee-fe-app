import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
} from "react-native-reanimated";
import { router } from "expo-router";

import {
  ChevronLeft,
  Search,
  ShoppingCart,
  Share,
} from "@tamagui/lucide-icons";

import Skeleton from "../../components/Skeleton";

import {
  useTheme,
  Button,
  XStack,
  YStack,
  Text,
  Input,
  useThemeName,
} from "tamagui";
import { useDispatch, useSelector } from "react-redux";
import { viewStoreDetail } from "../../redux/slices/viewStoreSlice";
import backgroundSrc from "../../assets/images/background.jpg";
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
    >
      <Animated.View style={[StyleSheet.absoluteFill, whiteIconStyle]}>
        <WhiteIcon size={size} color="#FFFFFF" />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, blackIconStyle]}>
        <BlackIcon size={size} color="#FFFFFF" />
      </Animated.View>
    </Button>
  );
};

export default function StorePage() {
  const scrollY = useSharedValue(0);
  const theme = useTheme();
  const themeName = useThemeName();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollY.value,
      [ANIMATION_START_Y, ANIMATION_END_Y],
      ["rgba(255, 255, 255, 0)", theme.primary.val]
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

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) {
      return;
    }

    console.log("입력된 검색어:", searchQuery);
  };

  useEffect(() => {
    console.log("called");
    dispatch(viewStoreDetail(6));
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={theme.name === "dark" ? "light-content" : "dark-content"}
      />

      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.headerContent}>
            <CrossfadingIcon
              WhiteIcon={ChevronLeft}
              BlackIcon={ChevronLeft}
              size={28}
              whiteIconStyle={whiteIconAnimatedStyle}
              blackIconStyle={blackIconAnimatedStyle}
            />

            <Animated.Text style={[styles.headerTitle, titleAnimatedStyle]}>
              장씨네 과일가게
            </Animated.Text>
          </View>
        </SafeAreaView>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: HEADER_IMAGE_HEIGHT }}
      >
        {isLoading ? (
          <View style={styles.headerImage}>
            <Skeleton show={true} width="100%" />
          </View>
        ) : (
          <Image source={backgroundSrc} style={styles.headerImage} />
        )}
        <YStack bg="$background" style={styles.content}>
          <XStack
            flex={1}
            px="$2"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text style={styles.storeTitle}>장씨네 과일가게</Text>
            <Button
              color="#fff"
              fontWeight={500}
              backgroundColor="$primary"
              borderRadius={22}
              fontSize={13}
              height="$3"
              paddingHorizontal="$3"
              my="$2"
              onPress={() => router.push(`/storeInformation/${6}`)}
            >
              가게 정보
            </Button>
          </XStack>
          <XStack
            borderWidth={2}
            borderColor="$borderColor"
            borderRadius="$6"
            paddingHorizontal="$3"
            alignItems="center"
            gap="$1"
          >
            <Search color="$color10" size="$1" />

            <Input
              flex={1}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="검색해보세요"
              borderWidth={0}
              fontWeight="700"
              backgroundColor="transparent"
              onSubmitEditing={handleSearchSubmit}
            />
          </XStack>
          <Skeleton width={"50%"} show={isLoading} height={125}>
            <Text>테스트입니다</Text>
          </Skeleton>
        </YStack>
      </Animated.ScrollView>
    </View>
  );
}

// --- 스타일 정의 ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
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
    color: "#fff",
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
    borderRadius: 18,
    marginTop: -20,
    padding: 16,
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
    fontSize: 20,
    fontWeight: "bold",
  },
  longContentPlaceholder: {
    marginTop: 10,
    height: 1000, // 스크롤을 충분히 할 수 있도록 높이 설정
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
});
