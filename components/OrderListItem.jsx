// components/OrderListItem.js

import React from "react";
import { Card, YStack, XStack, Text, Image } from "tamagui";
import { router } from "expo-router";
import dayjs from "dayjs";

// 주문 상태에 따라 테마 변수와 텍스트를 반환합니다.
const getStatusProps = (status) => {
  switch (status) {
    case "PAID":
      return { text: "결제완료", themeColor: "$success" };
    case "PREPARING":
      return { text: "상품준비중", themeColor: "$info" };
    case "PENDING":
      return { text: "결제대기", themeColor: "$warning" };
    case "CANCELLED_ADMIN":
      return { text: "결제 취소(점주)", themeColor: "red" };
    case "CANCELLED_USER":
      return { text: "결제 취소", themeColor: "red" };
    default:
      return { text: status, themeColor: "$colorSecondary" };
  }
};

export default function OrderListItem({ order }) {
  if (!order) return null;
  console.log(order);
  const { text: statusText, themeColor } = getStatusProps(order.status);
  const firstItem = order.items?.[0];
  const representativeImage =
    firstItem?.product?.productImg || "https://via.placeholder.com/100";
  const representativeName =
    order.items.length > 1
      ? `${firstItem?.productName} 외 ${order.items.length - 1}건`
      : firstItem?.productName;

  return (
    <Card
      bordered
      marginHorizontal="$4"
      marginBottom="$4"
      padding="$4"
      // Card는 자동으로 테마의 cardBg, borderColor 등을 상속받습니다.
      onPress={() => router.push(`/order/detail/${order.orderId}`)}
      animation="bouncy"
      hoverStyle={{ scale: 0.975 }}
      pressStyle={{ scale: 0.95 }}
    >
      <YStack space="$3">
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$3" color="$colorSecondary">
            {" "}
            {dayjs(order.createdAt).format("YYYY.MM.DD")}
          </Text>
          <YStack
            borderWidth={1}
            borderColor={themeColor} // 👈 테마에 맞는 테두리 색상
            borderRadius="$5" // 👈 둥근 모서리 정도 (토큰 값 사용)
            paddingHorizontal="$1.5" // 👈 좌우 여백
            paddingVertical="$1.5" // 👈 상하 여백
            alignSelf="flex-start" // 👈 내용물 크기에 맞게 자동 조절
          >
            <Text
              fontSize="$3"
              // borderTopColor 속성은 YStack으로 옮겨졌으므로 삭제합니다.
              fontWeight="bold"
              color={themeColor}
            >
              {statusText}
            </Text>
          </YStack>
        </XStack>

        <XStack space="$4" alignItems="center">
          <Image
            source={{ uri: representativeImage }}
            width={80}
            height={80}
            borderRadius="$4"
            backgroundColor="$backgroundPress" // 👈 수정
          />
          <YStack flex={1} space="$1">
            <Text
              fontSize="$3"
              fontWeight="bold"
              numberOfLines={1}
              color="$color"
            >
              {order.store.storeName}
            </Text>
            <Text fontSize="$4" color="$colorSecondary" numberOfLines={2}>
              {representativeName}
            </Text>
            <Text
              fontSize="$3"
              fontWeight="bold"
              color="$primary"
              marginTop="$2"
            >
              {order.totalAmount.toLocaleString()}원
            </Text>
          </YStack>
        </XStack>
      </YStack>
    </Card>
  );
}
