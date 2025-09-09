import React, { useState, useRef, useEffect, useCallback } from "react";
import { ScrollView, YStack, Spinner, Button, Text } from "tamagui";
import { RefreshControl } from "react-native";

import OrderDetailCard from "../../components/OrderDetailCard";
import { useGetOrderDetailQuery } from "../../redux/api/apiSlice";
import { useLocalSearchParams, useFocusEffect } from "expo-router";

const OrderHistoryScreen = () => {
  const { orderId } = useLocalSearchParams();

  const scrollViewRef = useRef(null);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isCardExpanded) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [isCardExpanded]);

  const {
    data: order,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetOrderDetailQuery(orderId, {
    pollingInterval: 150000,
  });
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch().unwrap();
    } catch (err) {
      console.error("Failed to refetch order:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  if (isLoading) {
    return (
      <YStack flex={1} jc="center" ai="center">
        <Spinner size="large" color="$primary" />
      </YStack>
    );
  }

  if (isError || !order) {
    return (
      <YStack flex={1} jc="center" ai="center" gap="$3">
        <Text fontSize="$5">주문 내역을 불러오는 데 실패했습니다.</Text>
        <Button
          bg="$primary"
          color="white"
          fow="bold"
          w={120}
          onPress={() => refetch()}
        >
          다시 시도하기
        </Button>
      </YStack>
    );
  }

  return (
    <YStack f={1} bg="$background">
      <ScrollView
        ref={scrollViewRef}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor="#8E6559"
            colors={["#8E6559"]}
          />
        }
      >
        <OrderDetailCard
          order={order}
          statusHistory={order.statusHistory}
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
