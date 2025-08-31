import React from "react";
import { YStack, XStack, Text, Spinner, AnimatePresence } from "tamagui";
import {
  CheckCircle,
  Package,
  ShoppingCart,
  Archive,
  Ban,
} from "@tamagui/lucide-icons";

const STATUS_DETAILS = {
  PAID: { label: "결제완료", Icon: ShoppingCart },
  PREPARING: { label: "상품준비중", Icon: Package },
  PREPARED: { label: "준비완료", Icon: CheckCircle },
  RECEIVED: { label: "수령완료", Icon: Archive },
  CANCELLED: { label: "주문취소", Icon: Ban },
};

const STATUS_ORDER = ["PAID", "PREPARING", "PREPARED", "RECEIVED"];

/**
 * 타임스탬프 문자열을 날짜와 시간으로 포맷팅하는 함수
 * @param {string | Date} timestamp - ISO 8601 형식의 시간 문자열 또는 Date 객체
 * @returns {{date: string, time: string} | null} - 포맷팅된 날짜와 시간 객체
 */
const formatTimestamp = (timestamp) => {
  if (!timestamp) return null;

  try {
    const dateObj = new Date(timestamp);
    // 유효하지 않은 날짜인 경우 null 반환
    if (isNaN(dateObj.getTime())) {
      return null;
    }

    // 날짜 포맷: 29 July 2024
    const date = dateObj.toLocaleDateString("ko-kr", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    // 시간 포맷: 11:00 PM
    const time = dateObj.toLocaleTimeString("ko-kr", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return { date, time };
  } catch (error) {
    console.error("Invalid timestamp format:", error);
    return null;
  }
};

const OrderStatusSkeleton = () => (
  <XStack
    br={8}
    bg="$cardBg"
    jc="space-between"
    ai="flex-start"
    p="$2"
    o={0.5} // 반투명 효과
  >
    {Array.from({ length: 4 }).map((_, index) => (
      <YStack key={index} ai="center" gap="$2" f={1}>
        <YStack w={28} h={28} bg="$backgroundPress" br={8} />
        <YStack w="80%" h={14} bg="$backgroundPress" br={4} />
      </YStack>
    ))}
  </XStack>
);

const convertHistoryToObject = (historyArray = []) => {
  return historyArray.reduce((acc, item) => {
    acc[item.status] = item.updatedAt;
    return acc;
  }, {});
};
const OrderStatusTracker = ({
  currentStatus,
  statusHistory: historyArray = [], // Prop 이름을 historyArray로 명확히 함
  isLoading,
  isFetching,
}) => {
  const statusHistory = convertHistoryToObject(historyArray);

  if (
    currentStatus === "CANCELLED" ||
    currentStatus === "CANCELLED_ADMIN" ||
    currentStatus === "CANCELLED_USER"
  ) {
    const formattedTime = formatTimestamp(
      statusHistory.CANCELLED ||
        statusHistory.CANCELLED_ADMIN ||
        statusHistory.CANCELLED_USER
    );

    return (
      <XStack
        bg="$cardBg"
        p="$4"
        br="$4"
        gap="$4"
        ai="center"
        borderWidth={1}
        borderColor="$borderColor"
      >
        <Ban size={32} color="$error" />
        <YStack f={1}>
          <Text fontSize="$5" fontWeight="bold" color="$error">
            주문이 취소되었습니다.
          </Text>
          {formattedTime && (
            <Text fontSize="$3" color="$gray" mt="$1">
              {formattedTime.date} {formattedTime.time}
            </Text>
          )}
        </YStack>
      </XStack>
    );
  }

  if (isLoading) {
    return <OrderStatusSkeleton />;
  }

  const currentIndex = STATUS_ORDER.indexOf(currentStatus);

  return (
    <YStack pos="relative">
      <AnimatePresence>
        {isFetching && (
          <YStack
            pos="absolute"
            t={0}
            l={0}
            r={0}
            b={0}
            zi={1}
            br={8}
            bg="rgba(0,0,0,0.1)"
            jc="center"
            ai="center"
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          >
            <Spinner size="large" color="$primary" />
          </YStack>
        )}
      </AnimatePresence>
      <XStack br={8} bg="$cardBg" jc="space-between" ai="flex-start" p="$2">
        {STATUS_ORDER.map((status, index) => {
          const { label, Icon } = STATUS_DETAILS[status];
          const isActive = index <= currentIndex;
          const color = isActive ? "$primary" : "$gray10";
          const timestamp = statusHistory[status];
          const formattedTime = formatTimestamp(timestamp);

          return (
            <YStack key={status} ai="center" gap="$2" f={1}>
              <YStack
                p="$2"
                bg={isActive ? "$primary" : "$backgroundPress"}
                br={8}
              >
                <Icon size={12} color={isActive ? "white" : "$gray10"} />
              </YStack>
              <Text
                fontSize="$3"
                fontWeight={isActive ? "bold" : "normal"}
                color={color}
              >
                {label}
              </Text>
              {isActive && formattedTime && (
                <YStack ai="center" mt="$1.5">
                  <Text fontSize="$2.5" color="$gray11">
                    {formattedTime.date}
                  </Text>
                  <Text fontSize="$2.5" color="$gray11">
                    {formattedTime.time}
                  </Text>
                </YStack>
              )}
              {index < STATUS_ORDER.length - 1 && (
                <YStack
                  pos="absolute"
                  t="$3.5"
                  l="65%"
                  r="-35%"
                  h={2}
                  bg={index < currentIndex ? "$primary" : "$borderColor"}
                />
              )}
            </YStack>
          );
        })}
      </XStack>
    </YStack>
  );
};

export default OrderStatusTracker;
