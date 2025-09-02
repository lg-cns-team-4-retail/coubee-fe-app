// app/order/history.js

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { FlatList, RefreshControl } from "react-native";
import { YStack, Spinner, Text } from "tamagui";
import { router, useFocusEffect } from "expo-router";
import { useGetOrdersQuery } from "../../redux/api/apiSlice";
import OrderListItem from "../../components/OrderListItem";
import NewOrderListItem from "../../components/NewOrderListItem";
import ListEmptyComponent from "../../components/ListEmptyComponent";
import { useAuthContext } from "../contexts/AuthContext";
import { openModal } from "../../redux/slices/modalSlice";
import { useDispatch } from "react-redux";
import OrderHistoryHeader from "../../components/OrderHistoryHeader";

export default function OrderHistoryScreen() {
  const [page, setPage] = useState(0);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState(""); // 사용자의 즉각적인 입력을 위한 상태
  const [debouncedKeyword, setDebouncedKeyword] = useState(""); // API 호출을 위한 디바운싱된 상태

  const { isAuthenticated, isLoading: isAuthLoading } = useAuthContext();

  const { data, error, isLoading, isFetching, refetch } = useGetOrdersQuery(
    {
      page,
      size: 10,
      keyword: debouncedKeyword, // 검색어 파라미터 추가
    },
    { skip: !isAuthenticated }
  );
  const filteredOrders = useMemo(() => {
    return data?.content?.filter((order) => order.status !== "PENDING") || [];
  }, [data]);

  const loadMore = () => {
    if (!isFetching && !data?.last) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    // 사용자가 타이핑을 멈추고 500ms가 지나면 API 호출용 상태를 업데이트합니다.
    const handler = setTimeout(() => {
      setDebouncedKeyword(searchQuery);
    }, 500);

    // 이전 타이머를 정리하여 불필요한 실행을 방지합니다.
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    setPage(0);
  }, [debouncedKeyword]);

  useFocusEffect(
    useCallback(() => {
      if (!isAuthLoading && !isAuthenticated) {
        dispatch(
          openModal({
            type: "warning",
            title: "로그인이 필요합니다",
            message: "주문 내역을 확인하려면 먼저 로그인해주세요.",
            confirmText: "로그인하기",
            onConfirm: () => {
              router.replace("/login");
            },
            onCancel: () => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/(tabs)");
              }
            },
            cancelText: "다음에 할게요",
          })
        );
      }
    }, [isAuthLoading, isAuthenticated, dispatch])
  );
  const onRefresh = useCallback(async () => {
    setPage(0);
    await refetch();
  }, [refetch]);

  if (isAuthLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" color="$primary" />
      </YStack>
    );
  }

  if (!isAuthenticated) {
    return <YStack flex={1} backgroundColor="$background" />;
  }

  const renderItem = ({ item }) => <NewOrderListItem order={item} />;

  if (isLoading && page === 0) {
    return (
      <>
        <YStack flex={1} justifyContent="center" alignItems="center">
          <Spinner size="large" color="$primary" />
        </YStack>
      </>
    );
  }

  if (error) {
    return (
      <>
        <YStack flex={1} justifyContent="center" alignItems="center" gap="$2">
          <Text color="$error" fontWeight="bold">
            오류가 발생했습니다.
          </Text>
          <Text color="$colorSecondary">
            {error.data?.message || "다시 시도해주세요."}
          </Text>
        </YStack>
      </>
    );
  }

  return (
    <YStack flex={1} backgroundColor="$background">
      <OrderHistoryHeader
        userName={"환진"}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
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
            refreshing={isFetching && page === 0}
            onRefresh={onRefresh}
            tintColor={"#8E6559"}
          />
        }
      />
    </YStack>
  );
}
