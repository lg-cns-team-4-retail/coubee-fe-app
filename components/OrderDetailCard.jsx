import React from "react";
import { YStack, XStack, Text, Image, Paragraph } from "tamagui";
import OrderStatusTracker from "./OrderStatusTracker"; // 방금 만든 상태 추적 컴포넌트

// 상점 정보 카드
const StoreInfoCard = ({ store }) => (
  <YStack
    borderRadius="$6"
    borderWidth={1}
    borderColor="$borderColor"
    marginVertical="$2.5"
    backgroundColor="$background"
  >
    <YStack position="relative">
      <Image
        source={{ uri: store.backImg || "https://via.placeholder.com/400x150" }}
        height={120}
        width="100%"
        borderTopLeftRadius="$6"
        borderTopRightRadius="$6"
      />
      <Image
        source={{ uri: store.profileImg || "https://via.placeholder.com/100" }}
        width={80}
        height={80}
        borderRadius={999}
        borderWidth={3}
        borderColor="$background"
        position="absolute"
        bottom={-40}
        left="$4"
        zIndex={10}
      />
    </YStack>
    <YStack padding="$4" mt="$6">
      <Text fontSize="$7" fontWeight="bold" numberOfLines={1}>
        {store.storeName}
      </Text>
    </YStack>
  </YStack>
);

// 구매한 개별 상품 아이템
const OrderProductItem = ({ product }) => (
  <XStack p="$3" ai="center" gap="$3">
    <Image
      source={{ uri: product.productImg || "https://via.placeholder.com/100" }}
      width={60}
      height={60}
      borderRadius="$4"
    />
    <YStack f={1}>
      <Text fontWeight="bold">{product.productName}</Text>
      <Text color="$gray10">수량: {product.quantity}개</Text>
    </YStack>
    <Text fontWeight="bold">
      {(product.salePrice * product.quantity).toLocaleString()}원
    </Text>
  </XStack>
);

// 주문 상세 정보 전체를 감싸는 카드
const OrderDetailCard = ({ order }) => {
  return (
    <YStack
      gap="$4"
      p="$4"
      m="$3"
      borderRadius="$6"
      backgroundColor="$cardBg"
      elevation="$2"
    >
      {/* 주문 상태 */}
      <OrderStatusTracker currentStatus={order.status} />

      {/* 구분선 */}
      <YStack borderBottomWidth={1} borderColor="$borderColor" />

      {/* 상점 정보 */}
      <StoreInfoCard store={order.store} />

      {/* 구매 상품 목록 */}
      <YStack>
        <Text fontSize="$5" fontWeight="bold" mb="$2">
          주문 상품
        </Text>
        {order.products.map((product) => (
          <OrderProductItem key={product.productId} product={product} />
        ))}
      </YStack>
    </YStack>
  );
};

export default OrderDetailCard;
