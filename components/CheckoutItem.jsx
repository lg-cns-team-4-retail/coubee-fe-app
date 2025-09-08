import React from "react";
import { YStack, XStack, Image, Text, Button } from "tamagui";
import { Trash2, Plus, Minus } from "@tamagui/lucide-icons";
import { useDispatch } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeItem,
} from "../redux/slices/cartSlice";

export function CheckoutItem({
  productId, // productId를 props로 받아야 합니다.
  productName,
  description,
  productImg,
  salePrice,
  originPrice,
  quantity,
  availableStock,
}) {
  const dispatch = useDispatch();

  const handleDecrease = () => {
    if (quantity > 1) {
      dispatch(decreaseQuantity({ productId }));
    } else {
      // 수량이 1일 때 감소 버튼을 누르면 삭제
      dispatch(removeItem({ productId }));
    }
  };

  const handleIncrease = () => {
    if (quantity < availableStock) {
      dispatch(increaseQuantity({ productId }));
    }
  };

  const isSale = originPrice > salePrice;
  const formatPrice = (price) => {
    if (typeof price !== "number") return "";
    return `${price.toLocaleString("ko-KR")}원`;
  };
  const discountRate = isSale
    ? Math.round(((originPrice - salePrice) / originPrice) * 100)
    : 0;

  return (
    <XStack
      px="$3"
      py="$3"
      w={"90%"}
      backgroundColor="$cardBg"
      gap="$2"
      br="$5"
    >
      <YStack ai="center" justifyContent="space-between" gap="$2">
        <Image
          source={{ uri: productImg || "https://via.placeholder.com/100" }}
          w={85}
          h={85}
          br="$4"
        />
        <XStack gap="$3" alignItems="center">
          <Button
            icon={quantity > 1 ? Minus : Trash2}
            size="$2"
            circular
            onPress={handleDecrease}
          />
          <Text fontSize="$3" fontWeight="bold">
            {quantity}
          </Text>
          <Button
            icon={Plus}
            disabled={quantity >= availableStock}
            size="$2"
            circular
            onPress={handleIncrease}
          />
        </XStack>
      </YStack>
      <YStack f={1} gap="$1.5" jc="center">
        <Text fos="$4" fow="bold" numberOfLines={1}>
          {productName || "상품 이름을 불러오는 중"}
        </Text>
        <Text fos="$3" col="grey" numberOfLines={3} h={54}>
          {description || "상품 설명을 불러오는 중입니다."}
        </Text>
        {isSale ? (
          <XStack ai="flex-end" gap="$2" flexWrap="wrap">
            <Text fos="$4" col="red" fow="bold">
              {discountRate}%
            </Text>
            <Text fos="$4" fow="bold">{`${salePrice.toLocaleString(
              "ko-KR"
            )}원`}</Text>
            <Text
              fos="$3"
              textDecorationLine="line-through"
            >{`${originPrice.toLocaleString("ko-KR")}원`}</Text>
          </XStack>
        ) : (
          <Text fos="$4" fow="bold">
            {formatPrice(originPrice) || "가격 정보"}
          </Text>
        )}
      </YStack>
    </XStack>
  );
}
