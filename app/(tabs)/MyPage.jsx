import {
  Text,
  View,
  YStack,
  ScrollView,
  Separator,
  Button,
  XStack,
} from "tamagui";
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
import { useToastController } from "@tamagui/toast";

export default function TabTwoScreen() {
  const dispatch = useDispatch();
  const toast = useToastController();
  const {
    logout,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuthContext();

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
  } = useGetTotalDiscountQuery(undefined, {
    skip: !isAuthenticated,
  });
  const {
    data: stores,
    isLoading: isInterstStoresLoading,
    refetch: refetchStores,
  } = useGetInterestStoreQuery(undefined, {
    skip: !isAuthenticated,
  });

  const {
    data: products,
    isLoading: isRecommendedProductLoading,
    refetch: refetchProducts,
  } = useGetRecommendedProductQuery(undefined, {
    skip: !isAuthenticated,
  });

  const handleLogout = async () => {
    try {
      await logout();
      toast.show("로그아웃 성공");
    } catch (error) {
      toast.show("로그아웃에 실패했습니다");
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
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
      <ScrollView flex={1} backgroundColor="$background">
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

        <XStack ai="center" jc="center">
          <Button
            my="$2"
            width="50%"
            variant="outlined"
            bg="$primary"
            color="white"
            fontWeight="bold"
            size="$5"
            onPress={handleLogout}
          >
            로그아웃
          </Button>
        </XStack>
      </ScrollView>
    </View>
  );
}
