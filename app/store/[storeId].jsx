import React, { useState, useCallback, useMemo, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, StatusBar, Image } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  interpolateColor,
} from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import {
  ChevronLeft,
  Search,
  ShoppingCart,
  Heart,
} from "@tamagui/lucide-icons";
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
import { useToastController } from "@tamagui/toast";
import {
  useGetProductsQuery,
  useGetStoreDetailQuery,
  useToggleInterestMutation,
  useGetProductsInStoreQuery,
} from "../../redux/api/apiSlice";
import { selectProducts } from "../../redux/slices/uiSlice";
import ProductItem from "../../components/ProductItem";
import backgroundSrc from "../../assets/images/background.jpg";
import ProductCheckoutBar from "./ProductCheckoutBar";
import HorizontalSection from "./HorizontalSection";
import { useAuthContext } from "../contexts/AuthContext";
import { openModal } from "../../redux/slices/modalSlice";
import HotdealIndicator from "../../components/HotdealIndicator";
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
  const toast = useToastController();
  const scrollY = useSharedValue(0);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuthContext();

  const { storeId, keyword: initialKeyword } = useLocalSearchParams();

  // 1. 상태 관리 세분화
  const [searchQuery, setSearchQuery] = useState(initialKeyword || ""); // Input의 현재 값
  const [activeKeyword, setActiveKeyword] = useState(initialKeyword); // 실제 검색에 사용될 키워드

  const [toggleInterest, { isLoading: isToggling }] =
    useToggleInterestMutation();

  const [page, setPage] = useState(0);
  const [hPage, setHPage] = useState(0);
  const { data: storeDetail } = useGetStoreDetailQuery(storeId, {
    skip: !storeId,
  });

  const {
    data: products,
    totalElements,
    isLoading,
    isFetching,
  } = useGetProductsQuery({ storeId, page, size: 20 }, { skip: !storeId });

  const { data: keywordSearchResult, isFetching: isKeywordFetching } =
    useGetProductsInStoreQuery(
      { storeId, keyword: activeKeyword, page: hPage, size: 5 }, // 페이지당 5개씩 로드
      { skip: !activeKeyword }
    );

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
    const newKeyword = searchQuery.trim();
    if (!newKeyword) return;

    setHPage(0); // 페이지를 0으로 리셋
    setActiveKeyword(newKeyword);
  }, [searchQuery]);

  const handleHorizontalLoadMore = () => {
    if (
      keywordSearchResult &&
      !keywordSearchResult.last &&
      !isKeywordFetching
    ) {
      setHPage((prevPage) => prevPage + 1);
    }
  };

  const handleCheckOut = () => {
    router.push("/checkout");
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
      <ProductItem
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

  const handleLikePress = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch(
        openModal({
          type: "warning",
          title: "로그인이 필요해요",
          message: "관심 매장 등록은 로그인 이후에 가능하세요",
          confirmText: "로그인 하러 가기",
          cancelText: "취소",
          onConfirm: () => {
            router.replace("/login");
          },
          onCancel: () => {},
        })
      );
    } else {
      const isCurrentlyLiked = storeDetail?.interest;

      try {
        await toggleInterest(storeId).unwrap();

        toast.show(
          isCurrentlyLiked
            ? "관심 가게에서 삭제했어요."
            : "관심 가게로 등록했어요."
        );
      } catch (error) {
        console.error("관심 가게 변경 실패:", error);
        toast.show("요청에 실패했습니다.");
      }
    }
  }, [isAuthenticated, dispatch, storeId, toggleInterest, storeDetail, toast]);
  console.log(storeDetail?.backImg, "back img");
  const renderListHeader = useMemo(
    () => (
      <>
        <Image
          source={{ uri: storeDetail?.backImg }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <YStack bg="$background" style={styles.content} px="$4">
          <XStack py="$4" ai="center">
            <HotdealIndicator hotdeal={storeDetail?.hotdeal} />
          </XStack>
          <XStack
            flex={1}
            px="$3"
            py="$2"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text style={styles.storeTitle}>{storeDetail?.storeName}</Text>

            <XStack ai="center" gap="$2">
              <Button
                circular
                chromeless
                onPress={handleLikePress}
                disabled={isToggling}
                icon={
                  <Heart
                    size={24}
                    fill={storeDetail?.interest ? "red" : "transparent"}
                    color={storeDetail?.interest ? "red" : "gray"}
                  />
                }
              />

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

          <HorizontalSection
            title={`'${activeKeyword}'(으)로 검색한 상품`}
            products={keywordSearchResult?.content}
            isLoading={isKeywordFetching && hPage === 0}
            isFetchingMore={isKeywordFetching && hPage > 0}
            onLoadMore={handleHorizontalLoadMore}
          />

          <YStack py="$4" gap="$4">
            <Text fontSize="$4" fontWeight="bold">
              {`전체상품 (${products?.totalElements})개`}
            </Text>
          </YStack>
        </YStack>
      </>
    ),
    [
      searchQuery,
      storeId,
      handleSearchSubmit,
      storeDetail,
      products,
      handleLikePress,
      isToggling,
      activeKeyword,
      hPage,
      keywordSearchResult,
      isKeywordFetching,
    ]
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
            <Animated.View style={[{ width: 28 }, blackIconAnimatedStyle]}>
              <Button
                unstyled
                chromeless
                scaleIcon={1.2}
                onPress={handleLikePress}
                disabled={isToggling}
                icon={
                  <Heart
                    fill={storeDetail?.interest ? "white" : "transparent"}
                    color={"white"}
                  />
                }
              />
            </Animated.View>
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
