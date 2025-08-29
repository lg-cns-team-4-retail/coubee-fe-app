import React, { useState, useCallback } from "react";
// 👇 Sheet.ScrollView를 사용하기 위해 ScrollView와 Text를 Sheet와 함께 불러옵니다.
import { Sheet } from "@tamagui/sheet";
import { router } from "expo-router";
import { YStack, Text, Spinner } from "tamagui";
import StoreResult from "./StoreResult";
import { FlatList } from "react-native";

export default function SearchResultsSheet({
  searchResults = [],
  onLoadMore,
  isFetching,
}) {
  const [open, setOpen] = useState(true);
  const snapPoints = [85, 10];

  const renderStoreItem = useCallback(
    ({ item: store }) => (
      <StoreResult
        onPress={() => {
          router.push(`/store/${store.storeId}`);
        }}
        key={store.storeId}
        store={store}
      />
    ),
    []
  );

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
      snapPoints={snapPoints}
      defaultPosition={1}
      modal={false}
      dismissOnOverlayPress={false}
    >
      <Sheet.Handle backgroundColor="grey" />

      <Sheet.Frame
        flex={1}
        backgroundColor="$background"
        borderTopColor="black"
      >
        <YStack paddingHorizontal="$4" paddingTop="$4" paddingBottom="$2">
          <Text fontSize="$4" color="$color" fontWeight="bold">
            검색 결과
          </Text>
        </YStack>

        <FlatList
          data={searchResults}
          renderItem={renderStoreItem}
          keyExtractor={(item) => item.storeId.toString()}
          contentContainerStyle={{
            paddingHorizontal: 16, // tamagui 토큰 대신 숫자 값 사용
            paddingBottom: 16,
          }}
          // FlatList는 이 props들을 완벽하게 지원합니다.
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetching ? <Spinner marginVertical="$4" /> : null
          }
        />
      </Sheet.Frame>
    </Sheet>
  );
}
