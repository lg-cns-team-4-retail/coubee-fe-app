import React, { useState, useCallback, useMemo } from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
} from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft, Search, ShoppingCart } from "@tamagui/lucide-icons";
import {
  useTheme,
  Button,
  XStack,
  YStack,
  Text,
  Input,
  Spinner,
} from "tamagui";
import { useDispatch } from "react-redux";

import {
  useGetProductsQuery,
  useGetStoreDetailQuery,
} from "../../redux/api/apiSlice";
import { selectProducts } from "../../redux/slices/uiSlice";
import HorizontalProductItem from "../../components/HorizontalProductItem";
import backgroundSrc from "../../assets/images/background.jpg";
import ProductCheckoutBar from "./ProductCheckoutBar";
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
        <BlackIcon size={size} color="#ffffff" />
      </Animated.View>
    </Button>
  )
);

export default function StorePage() {
  const scrollY = useSharedValue(0);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { storeId } = useLocalSearchParams();
  console.log(storeId, "check");
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: storeDetail } = useGetStoreDetailQuery(storeId, {
    skip: !storeId,
  });

  const {
    data: products,
    isLoading,
    isFetching,
  } = useGetProductsQuery({ storeId, page, size: 20 }, { skip: !storeId });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });
  const handleLoadMore = () => {
    if (products) {
      console.log(`products.last 값: ${products.last}`);
    }

    if (!isFetching && products && !products.last) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  const handleSearchSubmit = useCallback(() => {
    if (!searchQuery.trim()) return;
    console.log("입력된 검색어:", searchQuery);
  }, [searchQuery]);

  const handleCheckOut = () => {
    console.log("hi");
  };

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      scrollY.value,
      [ANIMATION_START_Y, ANIMATION_END_Y],
      ["rgba(255, 255, 255, 0)", theme.primary.val]
    ),
  }));

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

  const renderItem = useCallback(
    ({ item }) => (
      <HorizontalProductItem
        item={item}
        loading={isLoading}
        onPress={() => {
          dispatch(selectProducts(item));
          router.push(`/productView/${item.productId}`);
        }}
      />
    ),
    [isLoading, dispatch]
  );

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
            <Text style={styles.storeTitle}>{storeDetail?.storeName}</Text>
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
    [searchQuery, storeId, handleSearchSubmit, storeDetail]
  );

  return (
    <YStack bg="$background" flex={1}>
      <StatusBar barStyle={"light-content"} />

      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <SafeAreaView>
          <View style={styles.headerContent}>
            <CrossfadingIcon
              WhiteIcon={ChevronLeft}
              BlackIcon={ChevronLeft}
              size={28}
              whiteIconStyle={whiteIconAnimatedStyle}
              blackIconStyle={blackIconAnimatedStyle}
            />
            <Animated.Text style={[styles.headerTitle, titleAnimatedStyle]}>
              {storeDetail?.storeName}
            </Animated.Text>
            <View style={{ width: 28 }} />
          </View>
        </SafeAreaView>
      </Animated.View>

      {isLoading && !products ? (
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner />
        </YStack>
      ) : (
        <Animated.FlatList
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          data={products?.content || []}
          keyExtractor={(item) => item.productId.toString()}
          renderItem={renderItem}
          ListHeaderComponent={renderListHeader}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetching ? (
              <YStack p="$4" ai="center">
                <Spinner />
              </YStack>
            ) : null
          }
        />
      )}

      <ProductCheckoutBar currentStoreId={storeId} onPress={handleCheckOut} />
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
    left: 60,
    right: 60,
    textAlign: "center",
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
  checkoutBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    elevation: 8, // 안드로이드 그림자
    shadowColor: "#000", // iOS 그림자
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
