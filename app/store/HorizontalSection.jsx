import React from "react";
import { YStack, Text, Spinner } from "tamagui";
import { FlatList } from "react-native";
import HorizontalProductItem from "../../components/HorizontalProductItem";
import { router } from "expo-router";

const HorizontalSection = ({
  title,
  products,
  isLoading,
  isFetchingMore, // 추가 로딩 상태 prop
  onLoadMore,
}) => {
  const renderItem = ({ item }) => (
    <YStack width={300} mr="$3">
      <HorizontalProductItem
        item={item}
        onPress={() => router.push(`/productView/${item.productId}`)}
      />
    </YStack>
  );

  if (isLoading) {
    return (
      <YStack h={100} ai="center" jc="center">
        <Spinner />
      </YStack>
    );
  }

  if (!products || products.length === 0) {
    return null; // 검색 결과가 없으면 아무것도 보여주지 않음
  }

  return (
    <YStack mt="$3" gap="$3">
      <Text fontSize="$4" fontWeight="bold" color="$color">
        {title}
      </Text>

      <FlatList
        horizontal
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.productId.toString()}
        showsHorizontalScrollIndicator={false}
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.5} // 오른쪽 끝 50% 지점에서 호출
        ListFooterComponent={isFetchingMore ? <Spinner mx="$4" /> : null}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        nestedScrollEnabled={true}
      />
    </YStack>
  );
};

export default HorizontalSection;
