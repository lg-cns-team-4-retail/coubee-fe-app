import React from "react";
import { ScrollView, XStack, YStack, Text } from "tamagui";
import HorizontalProductItem from "../../components/HorizontalProductItem";
import { router } from "expo-router";
// 예시 상품 데이터
const sampleProducts = [
  {
    productId: 1,
    productName: "신선한 제철 딸기 500g",
    description:
      "오늘 아침 농장에서 직접 수확한 신선한 딸기입니다. 달콤함이 남다릅니다.",
    productImg:
      "https://sitem.ssgcdn.com/05/89/64/item/1000555648905_i1_290.jpg",
    salePrice: 12000,
    originPrice: 15000,
    stock: 50,
  },
  {
    productId: 2,
    productName: "유기농 블루베리 200g",
    description: "첨가물 없이 건강하게 키운 유기농 블루베리 한 팩.",
    productImg:
      "https://sitem.ssgcdn.com/05/89/64/item/1000555648905_i1_290.jpg",
    salePrice: 9900,
    originPrice: 9900,
    stock: 30,
  },
  {
    productId: 3,
    productName: "고당도 샤인머스캣 1kg",
    description:
      "망고향이 나는 씨 없는 청포도, 샤인머스캣입니다. 선물용으로도 좋습니다.",
    productImg:
      "https://sitem.ssgcdn.com/05/89/64/item/1000555648905_i1_290.jpg",
    salePrice: 25000,
    originPrice: 30000,
    stock: 0, // 품절 예시
  },
  // ... 더 많은 상품 데이터
];

const HorizontalSection = ({ products = sampleProducts }) => {
  return (
    <YStack mt="$3" gap="$3">
      <Text fontSize="$4" fontWeight="bold" color="$color">
        검색하신 키워드로 검색한 결과입니다
      </Text>

      {/* 가로 스크롤 뷰 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: "$1", // 좌우 여백
          gap: "$3", // 아이템 사이 간격
        }}
      >
        <XStack gap={"$3"}>
          {products.map((product) => (
            // 👇 각 아이템에 너비를 지정하여 스크롤이 되도록 합니다.
            <YStack key={product.productId} width={300}>
              <HorizontalProductItem
                item={product}
                // loading={false} // 필요시 로딩 상태 전달
                onPress={() => {
                  router.push(`/productView/${product.productId}`);
                }}
              />
            </YStack>
          ))}
        </XStack>
      </ScrollView>
    </YStack>
  );
};

export default HorizontalSection;
