import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, Text, Button, Spinner, ScrollView, XStack } from "tamagui";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import { Alert } from "react-native";

import { CheckoutItem } from "../../components/CheckoutItem";
import ProductCheckoutBar from "../store/ProductCheckoutBar";
import { paymentAPI } from "../services/api";
import { useAuthContext } from "../contexts/AuthContext";

// 결제 수단 옵션
const PAYMENT_METHODS = [
  { id: "CARD", label: "신용카드" },
  { id: "KAKAOPAY", label: "카카오페이" },
  { id: "TOSSPAY", label: "토스페이" },
];

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  // 1. 선택된 결제 수단을 저장하기 위한 상태 추가
  const [selectedMethod, setSelectedMethod] = useState("CARD");

  const cartState = useSelector((state) => state.cart);
  const { items, storeId, totalSalePrice } = cartState;
  const { userId } = useAuthContext();

  const startPaymentFlow = async () => {
    if (!userId) {
      Alert.alert("오류", "로그인이 필요합니다.");
      router.push("/login");
      return;
    }
    if (items.length === 0) {
      Alert.alert("오류", "장바구니에 상품이 없습니다.");
      return;
    }

    setIsLoading(true);

    try {
      const configResponse = await paymentAPI.getPaymentConfig();
      const paymentConfig = configResponse.data;

      if (!paymentConfig) {
        throw new Error("결제 설정 정보를 불러오지 못했습니다.");
      }

      const orderData = {
        storeId: storeId,
        recipientName: userId,
        // 2. 하드코딩된 'CARD' 대신, 선택된 결제 수단(selectedMethod)을 사용
        paymentMethod: selectedMethod,
        totalAmount: totalSalePrice,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.productName,
          quantity: item.quantity,
          price: item.salePrice,
        })),
      };

      const orderResponse = await paymentAPI.createOrder(orderData);
      const createdOrder = orderResponse.data;

      const prepareData = {
        storeId: storeId,
        items: orderData.items,
      };
      await paymentAPI.preparePayment(createdOrder.orderId, prepareData);

      router.push({
        pathname: "/checkout/PaymentScreen",
        params: {
          paymentInfo: JSON.stringify({
            ...createdOrder,
            paymentMethod: orderData.paymentMethod,
          }),
          paymentConfig: JSON.stringify(paymentConfig),
        },
      });
    } catch (error) {
      Alert.alert(
        "주문 처리 중 오류",
        error.message || "알 수 없는 오류가 발생했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <YStack bg="$background" flex={1}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ alignItems: "center", paddingBottom: 150 }}
        >
          {/* 3. 결제 수단 선택 UI 추가 */}
          <YStack
            w="90%"
            gap="$3"
            py="$4"
            borderBottomWidth={1}
            borderColor="$borderColor"
          >
            <Text fontSize="$5" fontWeight="bold">
              결제 수단
            </Text>
            <XStack gap="$3" jc="space-between">
              {PAYMENT_METHODS.map((method) => (
                <Button
                  key={method.id}
                  flex={1}
                  onPress={() => setSelectedMethod(method.id)}
                  backgroundColor={
                    selectedMethod === method.id ? "$primary" : "transparent"
                  }
                  borderColor={
                    selectedMethod !== method.id ? "$borderColor" : undefined
                  }
                  borderWidth={selectedMethod !== method.id ? 1 : 0}
                  animation="bouncy"
                >
                  <Text
                    color={selectedMethod === method.id ? "white" : "$color"}
                  >
                    {method.label}
                  </Text>
                </Button>
              ))}
            </XStack>
          </YStack>

          <YStack alignItems="center" gap="$3" w="100%" pt="$4">
            {items && items.length > 0 ? (
              items.map((item) => (
                <CheckoutItem
                  key={item.productId}
                  productId={item.productId}
                  productName={item.productName}
                  description={item.description}
                  productImg={item.productImg}
                  salePrice={item.salePrice}
                  originPrice={item.originPrice}
                  quantity={item.quantity}
                />
              ))
            ) : (
              <Text mt="$10">장바구니가 비어있습니다.</Text>
            )}
          </YStack>
        </ScrollView>
      </SafeAreaView>

      <ProductCheckoutBar currentStoreId={storeId} onPress={startPaymentFlow} />

      {isLoading && (
        <YStack
          fullscreen
          alignItems="center"
          justifyContent="center"
          backgroundColor="rgba(0,0,0,0.5)"
        >
          <Spinner size="large" color="$color" />
          <Text color="white" mt="$2">
            주문 처리 중...
          </Text>
        </YStack>
      )}
    </YStack>
  );
}
