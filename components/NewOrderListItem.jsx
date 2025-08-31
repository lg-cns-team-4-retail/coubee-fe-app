// components/NewOrderListItem.js

import React from "react";
import { YStack, XStack, Text, Button, Paragraph } from "tamagui";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { openQRCodeModal } from "../redux/slices/uiSlice";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로케일 설정
dayjs.locale("ko"); // dayjs 한국어 설정 적용

// 주문 상태에 따른 텍스트와 테마를 반환하는 로직은 유지합니다.
const getStatusProps = (status) => {
  switch (status) {
    case "PAID":
      return { text: "결제완료", themeColor: "$success" };
    case "PREPARING":
      return { text: "상품준비중", themeColor: "$info" };
    case "PENDING":
      return { text: "결제대기", themeColor: "$warning" };
    case "PREPARED":
      return { text: "픽업 준비 완료", themeColor: "teal" };
    case "CANCELLED_ADMIN":
      return { text: "결제 취소(점주)", themeColor: "red" };
    case "CANCELLED_USER":
      return { text: "결제 취소", themeColor: "red" };
    case "RECEIVED":
      return { text: "픽업 완료", themeColor: "$primary" };
    default:
      return { text: status, themeColor: "$colorSecondary" };
  }
};

export default function NewOrderListItem({ order }) {
  const dispatch = useDispatch();
  if (!order) return null;

  const { text: statusText, themeColor } = getStatusProps(order.status);

  // '픽업하기' 버튼은 특정 상태에서만 보이도록 설정할 수 있습니다.
  const canPickup = ["PREPARED"].includes(order.status);

  const handleShowQRCode = () => {
    console.log("hi");
    dispatch(openQRCodeModal(order.orderId));
  };

  return (
    <YStack
      backgroundColor="$cardBg"
      borderRadius="$6"
      padding="$4"
      marginHorizontal="$4"
      marginBottom="$4"
      gap="$4"
      pressStyle={{ scale: 0.985, opacity: 0.9 }}
      animation="bouncy"
      onPress={() => router.push(`/orderDetail/${order.orderId}`)}
    >
      {/* 상단: 날짜와 주문 상태 */}
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$3" color="$gray10">
          {dayjs(order.createdAt).format("M월 D일 (ddd)")}
        </Text>
        <YStack
          borderWidth={1}
          borderColor={themeColor}
          borderRadius="$5"
          paddingHorizontal="$1.5"
          paddingVertical="$1.5"
          alignSelf="flex-start"
        >
          <Text fontSize="$3" fontWeight="bold" color={themeColor}>
            {statusText}
          </Text>
        </YStack>
      </XStack>

      {/* 중단: 가게 이름 및 상품 목록 */}
      <YStack space="$2.5">
        <Text fontSize="$5" fontWeight="bold">
          {order.store.storeName}
        </Text>
        {/* 모든 아이템을 목록으로 표시 */}
        {order.items.map((item) => (
          <Text key={item.productId} fontSize="$4" color="gray" my="$2">
            {item.productName} {item.quantity}개
          </Text>
        ))}
      </YStack>

      {/* 구분선 */}
      <YStack borderBottomWidth={1} borderColor="$borderColor" />

      {/* 하단: 결제 금액 */}
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$4" color="$gray11">
          결제금액
        </Text>
        <XStack gap="$2.5" alignItems="center">
          {order.discountRate > 0 && (
            <YStack
              backgroundColor="#C0D7FF"
              paddingHorizontal="$2.5"
              paddingVertical="$1.5"
              borderRadius="$4"
            >
              <Text fontSize="$2.5" color="#232DB8" fontWeight="bold">
                {order.discountRate}% 할인
              </Text>
            </YStack>
          )}
          <Text fontSize="$4" fontWeight="bold">
            {order.totalAmount.toLocaleString()}원
          </Text>
        </XStack>
      </XStack>

      {/* 최하단: 버튼 */}
      <XStack gap="$3" marginTop="$2">
        <Button
          variant="outlined"
          flex={1}
          onPress={() => router.push(`/orderDetail/${order.orderId}`)}
          borderWidth={1}
          fontWeight="bold"
          borderColor="$color"
        >
          주문 상세
        </Button>
        {canPickup && (
          <Button
            flex={1}
            bg="$primary"
            color="white"
            fontWeight="bold"
            onPress={handleShowQRCode}
          >
            픽업 코드
          </Button>
        )}
      </XStack>
    </YStack>
  );
}
