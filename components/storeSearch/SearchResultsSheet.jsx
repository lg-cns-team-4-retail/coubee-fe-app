// components/storeSearch/NewSearchResultsSheet.jsx

import React, { useMemo } from "react";
import { router } from "expo-router";
import { YStack, Text, Spinner, View } from "tamagui";
import StoreResult from "./StoreResult";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useTheme } from "tamagui";
import StoreSkeleton from "./StoreSkeleton";

const CustomHandle = () => {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.background?.val,
        paddingVertical: 12,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: theme.borderColor?.val,
      }}
    >
      <View
        style={{
          width: 40,
          height: 5,
          borderRadius: 4,
          backgroundColor: theme.color?.val,
        }}
      />
    </View>
  );
};

export default function SearchResultsSheet({
  searchResults = [],
  onLoadMore,
  isFetching,
  isLoading,
  totalResults,
}) {
  const snapPoints = useMemo(() => ["10%", "85%"], []);
  const theme = useTheme();
  const headerText = `검색 결과 (${totalResults || 0})`;
  const renderStoreItem = ({ item: store }) => (
    <StoreResult
      onPress={() => router.push(`/store/${store.storeId}`)}
      key={store.storeId}
      store={store}
    />
  );

  return (
    <BottomSheet
      index={1}
      snapPoints={snapPoints}
      handleComponent={CustomHandle}
      backgroundStyle={{ backgroundColor: theme.background?.val }}
    >
      {isLoading ? (
        <YStack px="$4" gap="$2">
          <Text fontSize="$4" color="$color" fontWeight="bold" p="$3">
            검색중입니다
          </Text>
          <StoreSkeleton />
          <StoreSkeleton />
          <StoreSkeleton />
        </YStack>
      ) : (
        <>
          <YStack
            paddingHorizontal="$4"
            paddingTop="$2"
            paddingBottom="$2"
            backgroundColor="$background"
            borderTopWidth={1}
            borderTopColor="$borderColor"
          >
            <Text p="$3" fontSize="$4" color="$color" fontWeight="bold">
              {headerText}
            </Text>
          </YStack>

          <BottomSheetFlatList
            data={searchResults}
            renderItem={renderStoreItem}
            keyExtractor={(item) => item.storeId.toString()}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 16,
            }}
            onEndReached={onLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isFetching ? <Spinner marginVertical="$4" /> : null
            }
          />
        </>
      )}
    </BottomSheet>
  );
}
