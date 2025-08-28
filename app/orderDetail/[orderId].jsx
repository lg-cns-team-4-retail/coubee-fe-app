import React, { useState, useRef, useEffect } from "react";
import { ScrollView, YStack, Spinner } from "tamagui";
import OrderDetailCard from "../../components/OrderDetailCard";
import { useGetOrderDetailQuery } from "../../redux/api/apiSlice";
import { useLocalSearchParams } from "expo-router";

const sampleOrder = {
  orderId: "ORDER-12345",
  status: "PREPARING", // PAID, PREPARING, PREPARED, RECEIVED, CANCELLED
  store: {
    storeId: 1041,
    storeName: "장충동악세서리",
    backImg:
      "https://d1du1htkbm5yt2.cloudfront.net/store/background/3e4d04e5-c2f3-4a7b-b322-7c28a36f2dec.jpeg",
    profileImg:
      "https://d1du1htkbm5yt2.cloudfront.net/store/profile/741802bc-0040-4fff-a107-128616e705e0.jpeg",
    description:
      "지역 고객의 일상을 채우는 라이프스타일 스토어입니다. 정성스러운 응대와 맞춤 주문를 제공해 원하시는 제품을 찾아드릴게요.",
    workingHour: "평일 오전10:00~오후10:00 주말 오전10:00~오후7:00",
    storeAddress: "서울 중구 장충동2가 187-21",
  },
  products: [
    {
      productId: 1,
      productName: "신선한 제철 딸기 500g",
      productImg:
        "https://d1du1htkbm5yt2.cloudfront.net/store/profile/741802bc-0040-4fff-a107-128616e705e0.jpeg",
      salePrice: 12000,
      quantity: 2,
    },
    {
      productId: 2,
      productName: "유기농 블루베리 200g",
      productImg:
        "https://d1du1htkbm5yt2.cloudfront.net/store/profile/741802bc-0040-4fff-a107-128616e705e0.jpeg",
      salePrice: 9900,
      quantity: 1,
    },
  ],
};

const sampleCancelledOrder = {
  ...sampleOrder,
  orderId: "ORDER-67890",
  status: "CANCELLED",
};

const OrderHistoryScreen = () => {
  const [statusHistory, setStatusHistory] = useState({
    PAID: "2024-07-29T23:00:00",
    PREPARING: "2024-07-29T23:15:00",
    PREPARED: null,
    RECEIVED: null,
    CANCELLED: null,
  });
  const { orderId } = useLocalSearchParams();

  const scrollViewRef = useRef(null);
  const [isCardExpanded, setIsCardExpanded] = useState(false);

  useEffect(() => {
    if (isCardExpanded) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [isCardExpanded]);

  const {
    data: order, // API 응답 데이터 (transformResponse를 거친 후)
    isLoading, // 첫 요청 시 로딩 상태
    isFetching, // 데이터를 다시 불러올 때 (refetch) 로딩 상태
    isError, // 요청 실패 여부
    error, // 에러 정보
  } = useGetOrderDetailQuery(orderId, {
    pollingInterval: 3000000,
  });

  if (isLoading || isFetching) {
    return (
      <>
        <YStack flex={1} jc="center" ai="center">
          <Spinner size="large" color="$primary" />
        </YStack>
      </>
    );
  }
  return (
    <YStack f={1} bg="$background">
      <ScrollView ref={scrollViewRef}>
        <OrderDetailCard
          order={order}
          statusHistory={statusHistory}
          isExpanded={isCardExpanded}
          onExpandChange={setIsCardExpanded}
          isLoading={isLoading}
          isFetching={isFetching}
        />
      </ScrollView>
    </YStack>
  );
};

export default OrderHistoryScreen;
