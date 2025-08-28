import React, { useState } from "react";
import { YStack, XStack, Text, Image, Pressable } from "tamagui"; // 'Paragraph' 제거
import { ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import OrderStatusTracker from "./OrderStatusTracker";
import OrderStoreInfoCard from "./OrderStoreInfoCard";
import KakaoMap from "./KakaoMap";

// 주문 상세 정보 전체를 감싸는 카드
const OrderDetailCard = ({
  order,
  statusHistory,
  isExpanded,
  onExpandChange,
  isLoading,
  isFetching,
}) => {
  return (
    <YStack gap="$1" p="$3" m="$3" borderRadius="$6">
      {/* 주문 상태 */}
      <OrderStatusTracker
        currentStatus={order?.status}
        statusHistory={statusHistory}
        isLoading={isLoading}
        isFetching={isFetching}
      />

      <KakaoMap
        latitude={37.559661293097975}
        longitude={127.0053580437816}
        height={350}
      />

      {/* 구분선 */}
      <YStack borderBottomWidth={1} borderColor="$borderColor" />

      {/* 상점 정보 */}
      <OrderStoreInfoCard
        store={order?.store}
        product={order?.items}
        isExpanded={isExpanded}
        onExpandChange={onExpandChange}
      />
    </YStack>
  );
};

export default OrderDetailCard;
