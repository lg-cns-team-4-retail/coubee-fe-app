import React from "react";
import { YStack, XStack, Text, Image } from "tamagui";

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
      px="$3"
      py="$3"
      bg="$cardBg"
      gap="$3"
      borderRadius={8}
      onPress={onPress}
      pressStyle={{ backgroundColor: "$backgroundPress" }}
      animation="bouncy"
    >
      <YStack ai="center" jc="center">
        <Image
          source={{
            uri: item?.productImg || "https://via.placeholder.com/100",
            width: 90,
            height: 90,
          }}
          w={85}
          h={85}
          br="$4"
          alt={item?.productName}
        />
      </YStack>
      <YStack f={1} gap="$1.5" jc="center">
        <Text fos="$4" fow="bold" numberOfLines={1}>
          {item?.productName || "상품 이름을 불러오는 중"}
        </Text>
        <Text fos="$3" col="grey" numberOfLines={2}>
          {item?.description ||
            "상품 설명을 불러오는 중입니다. 잠시만 기다려주세요."}
        </Text>

        <YStack minHeight={50} jc="center">
          {isSale ? (
            <XStack ai="flex-end" gap="$2" flexWrap="wrap">
              <Text fos="$4" col="red" fow="bold">
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
        </YStack>
        <Text fos="$3" col="grey" mt="$1">
          {item?.stock ? `남은 수량: ${item.stock}개` : "품절"}
        </Text>
      </YStack>
    </XStack>
  );
};

export default React.memo(HorizontalProductItem);
