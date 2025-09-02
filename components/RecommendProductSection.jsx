import React from "react";
import { FlatList } from "react-native";
import { YStack, Text, Paragraph, Spinner, Button, XStack } from "tamagui";
import HorizontalProductItem from "./HorizontalProductItem";
import { ChevronRight } from "@tamagui/lucide-icons";
import Skeleton from "./Skeleton";
import { router } from "expo-router";
import ListEmptyComponent from "./ListEmptyComponent";

const RecommendedProductSection = ({ userName, products, isLoading }) => {
  const handleProductPress = (productId) => {
    console.log(`Product ${productId} pressed!`);
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
      <HorizontalProductItem
        item={item}
        onPress={() => router.push(`/productView/${item.productId}`)}
      />
    </YStack>
  );

  return (
    <YStack gap="$3" py="$4">
      <XStack px="$4" justifyContent="space-between" alignItems="center">
        {/* 왼쪽: 텍스트 영역 */}
        <YStack>
          <Paragraph size="$8" fontWeight="bold">
            <Text color="$info">{userName}</Text>님에게
          </Paragraph>
          <Paragraph size="$8" fontWeight="bold" color="$gray11">
            추천하는 물품이에요
          </Paragraph>
        </YStack>
        {products && products.length > 0 && (
          <Button
            size="$3"
            chromeless
            iconAfter={ChevronRight}
            onPress={() =>
              router.push({
                pathname: "/myList",
                params: { initialTab: "products" },
              })
            }
          >
            더보기
          </Button>
        )}
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
