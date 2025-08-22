import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, XStack } from "tamagui";
import { CheckoutItem } from "../../components/CheckoutItem";
import ProductCheckoutBar from "../store/ProductCheckoutBar";

export default function CheckoutPage() {
  const handleQuantityChange = () => {
    console.log("hi");
  };
  const onDelete = () => {
    console.log("bye");
  };

  const item = {
    productId: 3172,
    productName:
      "[바로배송][해신수산]  완도활전복 특특大 6-7미 1kg_국내산(양식)",
    description:
      "[바로배송][해신수산]  완도활전복 특특大 6-7미 1kg_국내산(양식) — 균일한 품질과(와) 부담 없이 즐기는 담백함이(가) 돋보입니다. 일상 요리에 폭넓게 활용해 보세요.",
    productImg:
      "https://sitem.ssgcdn.com/59/74/91/item/1000038917459_i1_290.jpg",
    originPrice: 65900,
    salePrice: 46130,
    stock: 39,
    storeId: 1176,
  };
  return (
    <YStack bg="$background" flex={1}>
      <SafeAreaView>
        <YStack alignItems="center" gap="$3">
          <CheckoutItem
            title={item.productName}
            description={item.description}
            image={item.productImg}
            salePrice={item.salePrice}
            originalPrice={item.originPrice}
            quantity={4}
            onQuantityChange={handleQuantityChange}
            onDelete={onDelete}
          />
          <CheckoutItem
            title={item.productName}
            description={item.description}
            image={item.productImg}
            salePrice={item.salePrice}
            originalPrice={item.originPrice}
            quantity={4}
            onQuantityChange={handleQuantityChange}
            onDelete={onDelete}
          />
          <CheckoutItem
            title={item.productName}
            description={item.description}
            image={item.productImg}
            salePrice={item.salePrice}
            originalPrice={item.originPrice}
            quantity={4}
            onQuantityChange={handleQuantityChange}
            onDelete={onDelete}
          />
        </YStack>
      </SafeAreaView>

      <ProductCheckoutBar
        currentStoreId={1177}
        onPress={() => console.log("hi")}
      />
    </YStack>
  );
}
