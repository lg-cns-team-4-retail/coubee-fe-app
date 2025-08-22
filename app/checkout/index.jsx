import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack } from "tamagui";
import { CheckoutItem } from "../../components/CheckoutItem";
import ProductCheckoutBar from "../store/ProductCheckoutBar";
import { useSelector } from "react-redux";

export default function CheckoutPage() {
  const {
    items: products,
    storeId,
    originPrice,
    salePrice,
    totalQuantity,
  } = useSelector((state) => state.cart);
  const handleQuantityChange = () => {
    console.log("hi");
  };
  const onDelete = () => {
    console.log("bye");
  };

  return (
    <YStack bg="$background" flex={1}>
      <SafeAreaView>
        <YStack alignItems="center" gap="$3">
          {products &&
            products.map((item) => (
              <CheckoutItem
                productId={item.productId}
                productName={item.productName}
                description={item.description}
                productImg={item.productImg}
                salePrice={item.salePrice}
                originPrice={item.originPrice}
                quantity={item.quantity}
                onQuantityChange={handleQuantityChange}
                onDelete={onDelete}
              />
            ))}
        </YStack>
      </SafeAreaView>

      <ProductCheckoutBar
        currentStoreId={1177}
        onPress={() => console.log("hi")}
      />
    </YStack>
  );
}
