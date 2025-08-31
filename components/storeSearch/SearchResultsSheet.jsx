// components/storeSearch/NewSearchResultsSheet.jsx

import React, { useMemo } from "react";
import { router } from "expo-router";
import { YStack, Text, Spinner, View } from "tamagui";
import StoreResult from "./StoreResult";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useTheme } from "tamagui";
const CustomHandle = () => (
  <View
    bg="$background"
    style={{
      paddingVertical: 12,
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      alignItems: "center",
    }}
  >
    <View
      bg="$color"
      style={{
        width: 40,
        height: 5,
        borderRadius: 4,
      }}
    />
  </View>
);

export default function SearchResultsSheet({
  searchResults = [],
  onLoadMore,
  isFetching,
}) {
  const snapPoints = useMemo(() => ["10%", "85%"], []);
  const theme = useTheme();
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
    >
      <YStack
        paddingHorizontal="$4"
        paddingTop="$2"
        paddingBottom="$2"
        backgroundColor="$background"
      >
        <Text p="$3" fontSize="$4" color="$color" fontWeight="bold">
          검색 결과
        </Text>
      </YStack>

      <BottomSheetFlatList
        data={searchResults}
        renderItem={renderStoreItem}
        keyExtractor={(item) => item.storeId.toString()}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 16,
          backgroundColor: theme.background?.val,
        }}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetching ? <Spinner marginVertical="$4" /> : null
        }
      />
    </BottomSheet>
  );
}
