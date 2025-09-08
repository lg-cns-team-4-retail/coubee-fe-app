import React from "react";
import { FlatList } from "react-native";
import { YStack, Text, Paragraph, Spinner, Button, XStack } from "tamagui";
import HorizontalProductItem from "../HorizontalProductItem";
import { ChevronRight } from "@tamagui/lucide-icons";
import { router } from "expo-router";
import ListEmptyComponent from "../ListEmptyComponent";
import { useAuthContext } from "../../app/contexts/AuthContext";
import StoreResult from "../storeSearch/StoreResult";

const PopularStoreSection = ({ userName, stores, isLoading }) => {
  const { logout, userId, isAuthenticated, nickname } = useAuthContext();

  const handleStorePress = (productId) => {};

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
        store={item}
        onPress={() => router.push(`/store/${item.storeId}`)}
      />
    </YStack>
  );

  return (
    <YStack gap="$3" py="$4">
      <XStack px="$4" justifyContent="space-between" alignItems="center">
        {/* 왼쪽: 텍스트 영역 */}
        <YStack>
          <Paragraph size="$8" color="gray" fontWeight="bold">
            지금은 이곳이 인기있어요
          </Paragraph>
          <Paragraph size="$8" fontWeight="bold" color="$color">
            <Text color="$info">{isAuthenticated ? nickname : "사용자"}</Text>님
            근처 있는 매장
          </Paragraph>
        </YStack>
      </XStack>

      {!stores || stores.length === 0 ? (
        <ListEmptyComponent message={"주변 인기 있는 매장이 존재하지 않아요"} />
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

export default PopularStoreSection;
