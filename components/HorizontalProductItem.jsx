import React from "react";
import { YStack, XStack, Text, Image } from "tamagui";
import Skeleton from "./Skeleton";

const formatPrice = (price) => {
  if (typeof price !== "number") {
    return "";
  }
  return `${price.toLocaleString("ko-KR")}원`;
};

const HorizontalProductItem = ({ item, loading, onPress }) => {
  const isSale = item && item.originPrice > item.salePrice;

  const discountRate = isSale
    ? Math.round(((item.originPrice - item.salePrice) / item.originPrice) * 100)
    : 0;

  return (
    <XStack
      p="$3"
      borderBottomWidth={1}
      borderColor="$borderColor"
      gap="$3"
      onPress={onPress}
      pressStyle={{ backgroundColor: "$backgroundPress" }}
      animation="bouncy"
    >
      <YStack f={1} gap="$1.5" jc="center">
        <Text fos="$4" fow="bold" numberOfLines={1}>
          {item?.productName || "상품 이름을 불러오는 중"}
        </Text>

        <Text fos="$3" col="grey" numberOfLines={3} h={54}>
          {item?.description ||
            "상품 설명을 불러오는 중입니다. 잠시만 기다려주세요."}
        </Text>

        {isSale ? (
          <XStack ai="flex-end" gap="$2" flexWrap="wrap">
            <Text fos="$4" fow="bold">
              {discountRate}%
            </Text>
            <Text fos="$4" fow="bold">
              {`${item.salePrice.toLocaleString("ko-KR")}원`}
            </Text>
            <Text fos="$3" textDecorationLine="line-through">
              {`${item.originPrice.toLocaleString("ko-KR")}원`}
            </Text>
          </XStack>
        ) : (
          <Text fos="$4" fow="bold">
            {formatPrice(item?.originPrice) || "가격 정보"}
          </Text>
        )}

        <Text fos="$3" col="grey" mt="$1">
          {item?.stock ? `남은 수량: ${item.stock}개` : "품절"}
        </Text>
      </YStack>

      <YStack ai="center" jc="center">
        <Image
          source={{
            uri: item?.productImg || "https://via.placeholder.com/100",
            width: 100,
            height: 100,
          }}
          w={100}
          h={100}
          br="$4"
          alt={item?.productName}
        />
      </YStack>
    </XStack>
  );
};

export default HorizontalProductItem;
