// components/ProductItem.js

import React from "react";
import { Card, YStack, XStack, Text, Image } from "tamagui";
import Skeleton from "./Skeleton";

// 가격을 원화(KRW) 형식으로 변환하는 헬퍼 함수
const formatPrice = (price) => {
  if (typeof price !== "number") {
    return "";
  }
  return `${price.toLocaleString("ko-KR")}원`;
};

const ProductItem = ({ item, loading }) => {
  const hasSale = item?.originPrice > item?.salePrice;

  return (
    <Card bordered>
      <Skeleton show={loading} width={300} height={300}>
        <Card.Header p={0}>
          <Image
            source={{
              uri: item?.productImg || "https://via.placeholder.com/300",
              width: 300, // 이미지 크기를 지정해주는 것이 좋습니다.
              height: 300,
            }}
            aspectRatio={1}
            w="100%"
            alt={item?.productName}
          />
        </Card.Header>
      </Skeleton>

      <Card.Footer p="$3">
        <YStack f={1} gap="$1.5">
          <Skeleton show={loading}>
            <Text numberOfLines={2} h={45}>
              {item?.productName || "상품 이름을 불러오는 중입니다."}
            </Text>
          </Skeleton>

          <Skeleton show={loading}>
            <XStack ai="flex-end" gap="$2">
              <Text col="$red10" fow="bold">
                {/* salePrice가 originPrice보다 작을 때만 할인율 표시 (예시) */}
                {hasSale &&
                  `${Math.round(
                    ((item.originPrice - item.salePrice) / item.originPrice) *
                      100
                  )}%`}
              </Text>
              <Text fow="bold">{formatPrice(item?.salePrice) || "가격"}</Text>
            </XStack>
          </Skeleton>

          <Skeleton show={loading}>
            {hasSale && (
              <Text fos="$5" col="$gray10" textDecorationLine="line-through">
                {formatPrice(item?.originPrice)}
              </Text>
            )}
          </Skeleton>
        </YStack>
      </Card.Footer>
    </Card>
  );
};

export default ProductItem;
