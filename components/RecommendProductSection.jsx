import React from "react";
import { FlatList } from "react-native";
import { YStack, Text, Paragraph, Spinner, Button, XStack } from "tamagui";
import HorizontalProductItem from "./HorizontalProductItem";
import { ChevronRight } from "@tamagui/lucide-icons";
import Skeleton from "./Skeleton";
import { router } from "expo-router";
import ListEmptyComponent from "./ListEmptyComponent";
import { useAuthContext } from "../app/contexts/AuthContext";

const RecommendedProductSection = ({ userName, products, isLoading }) => {
  const { isAuthenticated, nickname } = useAuthContext();

  const handleProductPress = (productId) => {};

  /*   if (isLoading) {
    return (
      <YStack h={100} ai="center" jc="center">
        <Spinner />
      </YStack>
    );
  }
 */
  const renderItem = ({ item }) => (
    <YStack width="350" mr="$3">
      <HorizontalProductItem
        item={item}
        onPress={() =>
          router.push({
            pathname: `/store/${item.storeId}`,
            params: { openProduct: item.productId, keyword: item.productName },
          })
        }
      />
    </YStack>
  );

  return (
    <YStack gap="$3" py="$4">
      <XStack px="$4" justifyContent="space-between" alignItems="center">
        {/* 왼쪽: 텍스트 영역 */}
        <YStack>
          <Paragraph size="$8" color="gray" fontWeight="bold">
            <Text color="$info">{isAuthenticated ? nickname : "사용자"}</Text>
            님에게
          </Paragraph>
          <Paragraph size="$8" fontWeight="bold" color="$color">
            추천하는 물품이에요
          </Paragraph>
        </YStack>
      </XStack>

      {!products || products.length === 0 ? (
        <ListEmptyComponent message={"쿠비가 아직 추천 물품을 찾지 못했어요"} />
      ) : isLoading ? (
        <Spinner />
      ) : (
        <FlatList
          horizontal
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.productId.toString()}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      )}
    </YStack>
  );
};

export default RecommendedProductSection;
