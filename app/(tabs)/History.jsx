// app/order/history.js

import React, { useState, useMemo, useCallback } from "react";
import { FlatList, RefreshControl } from "react-native";
import { YStack, Spinner, Text } from "tamagui";
import { useGetOrdersQuery } from "../../redux/api/apiSlice";
import OrderListItem from "../../components/OrderListItem";
import ListEmptyComponent from "../../components/ListEmptyComponent";

export default function OrderHistoryScreen() {
  const [page, setPage] = useState(0);
  const { data, error, isLoading, isFetching, refetch } = useGetOrdersQuery({
    page,
    size: 10,
  });

  const filteredOrders = useMemo(() => {
    return data?.content?.filter((order) => order.status !== "PENDING") || [];
  }, [data]);

  const loadMore = () => {
    if (!isFetching && !data?.last) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  const onRefresh = useCallback(async () => {
    // 첫 페이지부터 다시 불러오기 위해 page 상태를 0으로 초기화합니다.
    setPage(0);
    // refetch 함수를 호출하여 API 요청을 다시 보냅니다.
    await refetch();
  }, [refetch]);

  const renderItem = ({ item }) => <OrderListItem order={item} />;

  if (isLoading && page === 0) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" color="$primary" />
      </YStack>
    );
  }

  if (error) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" space="$2">
        <Text color="$error" fontWeight="bold">
          오류가 발생했습니다.
        </Text>
        <Text color="$colorSecondary">
          {error.data?.message || "다시 시도해주세요."}
        </Text>
      </YStack>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <FlatList
        data={filteredOrders}
        renderItem={renderItem}
        keyExtractor={(item) => item.orderId}
        contentContainerStyle={{ paddingVertical: 16 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetching && <Spinner marginVertical={20} color="$primary" />
        }
        ListEmptyComponent={
          !isFetching && <ListEmptyComponent message="주문 내역이 없습니다." />
        }
        refreshControl={
          <RefreshControl
            refreshing={isFetching && page === 0} // 데이터를 불러오는 중일 때 스피너가 보이도록 설정
            onRefresh={onRefresh} // 당겼을 때 onRefresh 함수를 실행
            tintColor={"#8E6559"} // 스피너 색상 (전하의 메인 컬러)
          />
        }
      />
    </YStack>
  );
}
