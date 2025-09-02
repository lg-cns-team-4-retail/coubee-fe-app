import React from "react";
import { FlatList } from "react-native";
import { YStack, Text, Paragraph, Spinner, Button, XStack } from "tamagui";
import { ChevronRight } from "@tamagui/lucide-icons";
import StoreResult from "./storeSearch/StoreResult";
import { router } from "expo-router";
import ListEmptyComponent from "./ListEmptyComponent";

const InterestStoreSection = ({ userName, stores, isLoading }) => {
  const handleStoreRedirect = (storeId) => {
    console.log(`StoreId ${storeId} pressed!`);
  };

  if (isLoading) {
    return (
      <YStack h={100} ai="center" jc="center">
        <Spinner />
      </YStack>
    );
  }

  const renderItem = ({ item }) => (
    <YStack width="350" mr="$3">
      <StoreResult
        onPress={handleStoreRedirect}
        key={item.storeId}
        store={item}
      />
    </YStack>
  );

  return (
    <YStack gap="$3" py="$4">
      <XStack px="$4" justifyContent="space-between" alignItems="center">
        {/* 왼쪽: 텍스트 영역 */}
        <YStack>
          <Paragraph size="$8" fontWeight="bold">
            <Text color="$info">{userName}</Text>님이
          </Paragraph>
          <Paragraph size="$8" fontWeight="bold" color="$gray11">
            관심있어 하는 매장이에요
          </Paragraph>
        </YStack>
        {stores && stores.length > 0 && (
          <Button
            size="$3"
            chromeless
            iconAfter={ChevronRight}
            onPress={() =>
              router.push({
                pathname: "/myList",
                params: { initialTab: "stores" },
              })
            }
          >
            더보기
          </Button>
        )}
      </XStack>

      {!stores || stores.length === 0 ? (
        <ListEmptyComponent message={"관심매장이 존재하지 않습니다"} />
      ) : isLoading ? (
        <Spinner />
      ) : (
        <FlatList
          horizontal
          data={stores}
          renderItem={renderItem}
          keyExtractor={(item) => item.storeId.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      )}
    </YStack>
  );
};

export default InterestStoreSection;
