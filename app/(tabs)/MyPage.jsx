import { Text, View, YStack, ScrollView, Separator } from "tamagui";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { router, useFocusEffect } from "expo-router";
import { PurchaseSummaryCard } from "../../components/PurchaseSummaryCard";
import {
  useGetTotalDiscountQuery,
  useGetRecommendedProductQuery,
  useGetInterestStoreQuery,
} from "../../redux/api/apiSlice";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/modalSlice";
import { useAuthContext } from "../contexts/AuthContext";
import RecommendedProductSection from "../../components/RecommendProductSection";
import InterestStoreSection from "../../components/InterstStoreSection";

export default function TabTwoScreen() {
  const dispatch = useDispatch();

  const { isAuthenticated, isLoading: isAuthLoading } = useAuthContext();

  useFocusEffect(
    useCallback(() => {
      if (!isAuthLoading && !isAuthenticated) {
        dispatch(
          openModal({
            type: "warning",
            title: "로그인이 필요합니다",
            message: "마이 쿠비는 로그인이 필요해요.",
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

  const {
    data: summaryData,
    isLoading,
    refetch: refetchSummary,
  } = useGetTotalDiscountQuery();
  const {
    data: stores,
    isLoading: isInterstStoresLoading,
    refetch: refetchStores,
  } = useGetInterestStoreQuery();

  const {
    data: products,
    isLoading: isRecommendedProductLoading,
    refetch: refetchProducts,
  } = useGetRecommendedProductQuery();

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        console.log("마이페이지 탭 포커스됨. 데이터를 새로고침합니다.");
        refetchSummary();
        refetchStores();
        refetchProducts();
      }
    }, [isAuthenticated, refetchSummary, refetchStores, refetchProducts])
  );

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

  return (
    <View flex={1} bg="$background">
      {/* 👇 기존 YStack을 ScrollView로 교체하여 스크롤 기능을 부여합니다. */}
      <ScrollView flex={1} backgroundColor="$background">
        {/* 👇 ScrollView 내부에 content를 담을 YStack을 배치하고, gap으로 간격을 줍니다. */}
        <YStack padding="$4" gap="$1">
          <PurchaseSummaryCard data={summaryData} isLoading={isLoading} />

          <RecommendedProductSection
            userName={"환진"}
            products={products}
            isLoading={isRecommendedProductLoading}
          />

          <InterestStoreSection
            userName={"환진"}
            stores={stores}
            isLoading={isInterstStoresLoading}
          />
        </YStack>
      </ScrollView>
    </View>
  );
}
