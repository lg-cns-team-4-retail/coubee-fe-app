// components/NewOrderListItem.js

import React from "react";
import { YStack, XStack, Text, Button } from "tamagui";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { openQRCodeModal } from "../redux/slices/uiSlice";
import dayjs from "dayjs";
import "dayjs/locale/ko"; // 한국어 로케일 설정
dayjs.locale("ko"); // dayjs 한국어 설정 적용

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

// 가격 표시를 위한 헬퍼 컴포넌트
const PriceRow = ({ label, amount, isTotal = false, color = "$color" }) => (
  <XStack justifyContent="space-between" alignItems="center">
    <Text
      fontSize={isTotal ? "$4" : "$3"}
      color={isTotal ? "$color" : "gray"}
      fontWeight={isTotal ? "bold" : "normal"}
    >
      {label}
    </Text>
    <Text
      fontSize={isTotal ? "$4" : "$3"}
      color={color}
      fontWeight={isTotal ? "bold" : "normal"}
    >
      {amount.toLocaleString()}원
    </Text>
  </XStack>
);

export default function NewOrderListItem({ order }) {
  const dispatch = useDispatch();
  if (!order) return null;

  const { text: statusText, themeColor } = getStatusProps(order.status);
  const canPickup = ["PREPARED"].includes(order.status);

  const handleShowQRCode = () => {
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
          paddingHorizontal="$2"
          paddingVertical="$1"
          alignSelf="flex-start"
        >
          <Text fontSize="$3.5" fontWeight="bold" color={themeColor}>
            {statusText}
          </Text>
        </YStack>
      </XStack>

      {/* 중단: 가게 이름 및 상품 목록 */}
      <YStack space="$2.5">
        <Text fontSize="$5" fontWeight="bold">
          {order.store.storeName}
        </Text>
        <Text fontSize="$4" color="$gray11" numberOfLines={1}>
          {order.items[0].productName}
          {order.items.length > 1 && ` 외 ${order.items.length - 1}건`}
        </Text>
      </YStack>

      {/* 구분선 */}
      <YStack borderBottomWidth={1} borderColor="$borderColor" />

      {/* 하단: 결제 금액 (수정된 부분) */}
      <YStack gap="$2">
        <PriceRow label="상품 금액" amount={order.originalAmount} />
        {order.discountAmount > 0 && (
          <PriceRow
            label="할인 금액"
            amount={-order.discountAmount}
            color="red"
          />
        )}
        <PriceRow label="최종 금액" amount={order.totalAmount} isTotal={true} />
      </YStack>

      {/* 최하단: 버튼 */}
      <XStack gap="$3" marginTop="$2">
        <Button
          variant="outlined"
          flex={1}
          onPress={(e) => {
            e.stopPropagation();
            router.push(`/orderDetail/${order.orderId}`);
          }}
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
            onPress={(e) => {
              e.stopPropagation();
              handleShowQRCode();
            }}
          >
            픽업 코드
          </Button>
        )}
      </XStack>
    </YStack>
  );
}
