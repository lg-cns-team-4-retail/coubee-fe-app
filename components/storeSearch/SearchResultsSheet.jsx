import React, { useState } from "react";
// 👇 Sheet.ScrollView를 사용하기 위해 ScrollView와 Text를 Sheet와 함께 불러옵니다.
import { Sheet } from "@tamagui/sheet";
import { router } from "expo-router";
import { YStack, Text } from "tamagui";
import StoreResult from "./StoreResult"; // 전하의 StoreResult 컴포넌트

export default function SearchResultsSheet({ searchResults = [] }) {
  const [open, setOpen] = useState(true);
  // snapPoints는 전하의 뜻대로 유지합니다.
  const snapPoints = [85, 10];

  return (
    <Sheet
      open={open}
      onOpenChange={setOpen}
      snapPoints={snapPoints}
      defaultPosition={1} // 시작 위치는 최하단(인덱스 1)
      modal={false}
      dismissOnOverlayPress={false}
      // 복잡한 상호작용을 유발했던 position 상태 및 관련 속성들을 모두 제거하였습니다.
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

        {/* 👇 일반 ScrollView 대신 Sheet.ScrollView를 사용합니다. */}
        <Sheet.ScrollView
          flex={1}
          contentContainerStyle={{
            paddingHorizontal: "$4",
            gap: "$1",
            paddingBottom: "$4",
          }}
          showsVerticalScrollIndicator={false}
        >
          {searchResults.map((store) => (
            <StoreResult
              onPress={() => {
                /*  console.log("clcicked store"); */
                router.push(`/store/${store.storeId}`);
              }}
              key={store.storeId}
              store={store}
            />
          ))}
        </Sheet.ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
}
