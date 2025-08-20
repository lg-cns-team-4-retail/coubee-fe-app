import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  FlatList,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
} from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Search } from "@tamagui/lucide-icons";
import {
  useTheme,
  Button,
  XStack,
  YStack,
  Text,
  Input,
  Spinner,
} from "tamagui";
import { useDispatch, useSelector } from "react-redux";
import { viewStoreDetail } from "../../redux/slices/viewStoreSlice";
import {
  fetchProducts,
  clearProducts,
  selectProducts,
} from "../../redux/slices/productSlice";
import backgroundSrc from "../../assets/images/background.jpg";
import HorizontalProductItem from "../../components/HorizontalProductItem";

const HEADER_IMAGE_HEIGHT = 250;
const ANIMATION_START_Y = HEADER_IMAGE_HEIGHT * 0.5;
const ANIMATION_END_Y = HEADER_IMAGE_HEIGHT * 0.8;

const CrossfadingIcon = React.memo(
  ({ WhiteIcon, BlackIcon, size, whiteIconStyle, blackIconStyle }) => (
    <Button unstyled chromeless size="$2" onPress={() => router.back()}>
      <Animated.View style={[StyleSheet.absoluteFill, whiteIconStyle]}>
        <WhiteIcon size={size} color="#FFFFFF" />
      </Animated.View>
      <Animated.View style={[StyleSheet.absoluteFill, blackIconStyle]}>
        <BlackIcon size={size} color="#FFFFFF" />
      </Animated.View>
    </Button>
  )
);

export default function StorePage() {
  const scrollY = useSharedValue(0);
  const theme = useTheme();
  const dispatch = useDispatch();
  const storeDetail = useSelector((state) => state.viewStore.storeData);
  const { storeId } = useLocalSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const { products, loading, currentPage, isLastPage } = useSelector(
    (state) => state.productStore
  );

  useEffect(() => {
    if (storeId) {
      dispatch(viewStoreDetail(storeId));
      dispatch(clearProducts());
      dispatch(fetchProducts({ storeId, page: 0, size: 5 }));
    }
    return () => {
      dispatch(clearProducts());
    };
  }, [dispatch, storeId]);

  const loadMoreProducts = useCallback(() => {
    if (loading !== "pending" && !isLastPage && storeId) {
      dispatch(fetchProducts({ storeId, page: currentPage + 1, size: 5 }));
    }
  }, [dispatch, storeId, loading, isLastPage, currentPage]);

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

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [ANIMATION_START_Y, ANIMATION_END_Y],
      [0, 1],
      "clamp"
    ),
  }));

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

  const handleSearchSubmit = useCallback(() => {
    if (!searchQuery.trim()) return;
    console.log("입력된 검색어:", searchQuery);
  }, [searchQuery]);

  const renderListHeader = useMemo(
    () => (
      <>
        <Image source={backgroundSrc} style={styles.headerImage} />
        <YStack bg="$background" style={styles.content}>
          <XStack
            flex={1}
            px="$2"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text style={styles.storeTitle}>{storeDetail.storeName}</Text>
            <Button
              color="#fff"
              fontWeight="500"
              backgroundColor="$primary"
              borderRadius={22}
              fontSize={13}
              height="$3"
              paddingHorizontal="$3"
              my="$2"
              onPress={() => router.push(`/storeInformation/${storeId}`)}
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
        </YStack>
      </>
    ),
    [searchQuery, storeId, handleSearchSubmit]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <HorizontalProductItem
        item={item}
        loading={loading === "pending"}
        onPress={() => {
          console.log("Product pressed:", item.productId);
          dispatch(selectProducts(item));
          router.push(`/productView/${item.productId}`);
        }}
      />
    ),
    [loading]
  );

  return (
    <YStack bg="$background" style={styles.container}>
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
              {storeDetail.storeName}
            </Animated.Text>
          </View>
        </SafeAreaView>
      </Animated.View>

      <Animated.FlatList
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        data={products}
        keyExtractor={(item) => item.productId.toString()}
        renderItem={renderItem}
        ListHeaderComponent={renderListHeader}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading === "pending" ? (
            <YStack p="$4" ai="center">
              <Spinner />
            </YStack>
          ) : null
        }
      />
    </YStack>
  );
}

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
  headerImage: {
    width: "100%",
    height: HEADER_IMAGE_HEIGHT,
  },
  content: {
    borderRadius: 18,
    marginTop: -20,
    padding: 16,
  },
  storeTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
