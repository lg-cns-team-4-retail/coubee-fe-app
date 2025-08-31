import { useState, useMemo, useCallback, useEffect } from "react";
import { SafeAreaView } from "react-native";
import {
  YStack,
  XStack,
  Text,
  Button,
  Image,
  Separator,
  Paragraph,
  View,
  Spinner,
} from "tamagui";
import { ChevronLeft, Plus, Minus } from "@tamagui/lucide-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { useWindowDimensions } from "react-native";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addItem, replaceCart } from "../../redux/slices/cartSlice";
import { useAuthContext } from "../contexts/AuthContext";
import { openModal } from "../../redux/slices/modalSlice";
import { useGetProductDetailQuery } from "../../redux/api/apiSlice";
import { postViewCountProduct } from "../services/api";
import { useToastController } from "@tamagui/toast";

const CARD_INITIAL_Y_POSITION = 250;

export default function ProductDetailPage() {
  const toast = useToastController();
  const router = useRouter();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const { isAuthenticated } = useAuthContext();
  const { productId } = useLocalSearchParams();
  /*   const { cartStoreId, cartItemCount } = useSelector((state) => ({
    cartStoreId: state.cart.storeId,
    cartItemCount: state.cart.items.length,
  })); */
  const cartStoreId = useSelector((state) => state.cart.storeId);
  const cartItemCount = useSelector((state) => state.cart.items.length);
  const {
    data: item,
    isLoading,
    isError,
    isFetching,
    isSuccess,
    error,
  } = useGetProductDetailQuery(productId, { skip: !productId });

  //view count용
  useEffect(() => {
    if (productId) {
      postViewCountProduct(productId);
    }
  }, [productId]);

  if (isLoading || isFetching) {
    <YStack flex={1} justifyContent="center" alignItems="center">
      <Spinner />
    </YStack>;
  }

  const { height: screenHeight } = useWindowDimensions();

  const translateY = useSharedValue(0);
  const CLOSE_THRESHOLD = screenHeight / 4;

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateY.value = Math.max(0, event.translationY);
    })
    .onEnd(() => {
      if (translateY.value > CLOSE_THRESHOLD) {
        runOnJS(router.back)();
      } else {
        translateY.value = withSpring(0, { damping: 15 });
      }
    });

  const { isSale, discountRate } = useMemo(() => {
    const sale = item?.salePrice < item?.originPrice;
    const rate = sale
      ? Math.round(
          ((item?.originPrice - item?.salePrice) / item?.originPrice) * 100
        )
      : 0;
    return { isSale: sale, discountRate: rate };
  }, [item?.originPrice, item?.salePrice]);
  const totalPrice = useMemo(
    () => item?.salePrice * quantity,
    [item?.salePrice, quantity]
  );
  const handleIncreaseQuantity = useCallback(() => {
    setQuantity((prev) => Math.min(prev + 1, item?.stock));
  }, [item?.stock]);
  const handleDecreaseQuantity = useCallback(() => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  }, []);
  const animatedContentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const handleAddToCart = () => {
    const newItem = {
      productId: item?.productId,
      productName: item?.productName,
      description: item?.description,
      productImg: item?.productImg,
      originPrice: item?.originPrice,
      salePrice: item?.salePrice,
      storeId: item?.storeId,
      quantity,
    };

    if (cartItemCount > 0 && cartStoreId !== newItem.storeId) {
      dispatch(
        openModal({
          type: "warning",
          title: "장바구니에는 한 가게의 상품만 담을 수 있어요",
          message: "선택하신 상품을 담으면 이전에 담은 상품은 모두 사라져요.",
          confirmText: "새로 담기",
          cancelText: "취소",
          onConfirm: () => {
            dispatch(replaceCart(newItem));
            router.back();
          },
          onCancel: () => {},
        })
      );
      return;
    }

    if (!isAuthenticated) {
      dispatch(
        openModal({
          title: "로그인이 필요해요!",
          message: "로그인 후에 사용하실수있는 기능이에요",
          onConfirm: () => {
            router.replace("/login");
          },
        })
      );
    } else {
      dispatch(addItem(newItem));
      toast.show("상품 추가 완료", {
        message: `${newItem.productName}를 담았습니다`,
      });
      router.back();
    }
  };

  return (
    <YStack f={1} bg="$background">
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: screenHeight - 50,
          backgroundColor: "#8E6559",
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <Button
          pos="absolute"
          top={40}
          left="$4"
          zIndex={20}
          icon={<ChevronLeft size="$2" color="white" />}
          onPress={() => router.back()}
          circular
          chromeless
        />

        <YStack f={1}>
          <YStack h={CARD_INITIAL_Y_POSITION} />

          <GestureDetector gesture={gesture}>
            <Animated.View style={[{ flex: 1 }, animatedContentStyle]}>
              <YStack f={1} bg="$background" borderRadius={20}>
                <XStack ai="center" jc="center">
                  <Image
                    source={{ uri: item?.productImg, width: 200, height: 200 }}
                    br="$4"
                    mt={-100}
                  />
                </XStack>

                <YStack f={1} p="$4" pt="$2" gap="$4">
                  <XStack jc="space-between" ai="center">
                    <YStack f={1} mr="$2">
                      <Text fontSize={24} fontWeight="bold">
                        {item?.productName}
                      </Text>
                    </YStack>
                    <XStack
                      borderWidth={1}
                      borderColor="$borderColor"
                      br="$10"
                      ai="center"
                    >
                      <Button
                        icon={<Minus size="$1" />}
                        circular
                        chromeless
                        onPress={handleDecreaseQuantity}
                      />
                      <Text w={40} ta="center" fontSize={16}>
                        {quantity}
                      </Text>
                      <Button
                        icon={<Plus size="$1" />}
                        circular
                        chromeless
                        onPress={handleIncreaseQuantity}
                      />
                    </XStack>
                  </XStack>
                  <XStack ai="flex-end" gap="$2">
                    {isSale && (
                      <Text color="red" fontSize={22} fontWeight="bold">
                        {discountRate}%
                      </Text>
                    )}
                    <Text fontSize={22} fontWeight="bold">
                      {item?.salePrice.toLocaleString()}원
                    </Text>
                    {isSale && (
                      <Text textDecorationLine="line-through" color="$gray10">
                        {item?.originPrice.toLocaleString()}원
                      </Text>
                    )}
                  </XStack>
                  <Separator />
                  <YStack gap="$2">
                    <Text fos="$4" fow={700}>
                      상품 정보
                    </Text>
                    <Text my="$2" fos="$4" color="gray">
                      {item?.description}
                    </Text>
                    <Text color="$gray10">남은 수량: {item?.stock}개</Text>
                  </YStack>
                  <YStack f={1} />
                  <Button
                    size="$5"
                    bg="$primary"
                    color="white"
                    fontWeight={700}
                    onPress={handleAddToCart}
                  >
                    {totalPrice.toLocaleString() + "원 담기"}
                  </Button>
                </YStack>
              </YStack>
            </Animated.View>
          </GestureDetector>
        </YStack>
      </SafeAreaView>
    </YStack>
  );
}
