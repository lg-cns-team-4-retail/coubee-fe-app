import React from "react";
import { YStack, XStack, Text } from "tamagui";
import {
  CheckCircle,
  Package,
  ShoppingCart,
  Archive,
  Ban,
} from "@tamagui/lucide-icons";

// 주문 상태에 따른 한글 이름과 아이콘을 정의합니다.
const STATUS_DETAILS = {
  PAID: { label: "결제완료", Icon: ShoppingCart },
  PREPARING: { label: "상품준비중", Icon: Package },
  PREPARED: { label: "준비완료", Icon: CheckCircle },
  RECEIVED: { label: "수령완료", Icon: Archive },
  CANCELLED: { label: "주문취소", Icon: Ban },
};

// 주문 상태의 순서를 정의합니다.
const STATUS_ORDER = ["PAID", "PREPARING", "PREPARED", "RECEIVED"];

const OrderStatusTracker = ({ currentStatus }) => {
  // 취소된 주문은 별도로 처리합니다.
  if (currentStatus === "CANCELLED") {
    const { label, Icon } = STATUS_DETAILS.CANCELLED;
    return (
      <YStack ai="center" gap="$2" p="$4" bg="$red2" br="$4">
        <Icon size={32} color="$red10" />
        <Text fontSize="$5" fontWeight="bold" color="$red10">
          {label}
        </Text>
      </YStack>
    );
  }

  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  return (
    <XStack jc="space-between" ai="flex-start" p="$4">
      {STATUS_ORDER.map((status, index) => {
        const { label, Icon } = STATUS_DETAILS[status];
        const isActive = index <= currentIndex;
        const color = isActive ? "$primary" : "$gray10";

        return (
          <YStack key={status} ai="center" gap="$2" f={1}>
            {/* 아이콘 */}
            <YStack
              p="$2.5"
              bg={isActive ? "$primary" : "$backgroundPress"}
              br={999}
            >
              <Icon size={24} color={isActive ? "white" : "$gray10"} />
            </YStack>
            {/* 라벨 */}
            <Text
              fontSize="$2"
              fontWeight={isActive ? "bold" : "normal"}
              color={color}
            >
              {label}
            </Text>
            {/* 진행 바 */}
            {index < STATUS_ORDER.length - 1 && (
              <YStack
                pos="absolute"
                t="$3.5"
                l="65%"
                r="-35%"
                h={2}
                bg={isActive ? "$primary" : "$borderColor"}
              />
            )}
          </YStack>
        );
      })}
    </XStack>
  );
};

export default OrderStatusTracker;
