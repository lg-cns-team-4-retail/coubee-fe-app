// app/checkout/index.jsx

import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { YStack, Text, Button, Spinner } from "tamagui";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import { Alert } from "react-native";

import { CheckoutItem } from "../../components/CheckoutItem";
import ProductCheckoutBar from "../store/ProductCheckoutBar";
import { paymentAPI } from "../services/api"; // 1단계에서 추가한 API import
import { useAuthContext } from "../contexts/AuthContext";

export default function CheckoutPage() {
  const [isLoading, setIsLoading] = useState(false);
  const cartState = useSelector((state) => state.cart);
  const { items, storeId, totalSalePrice } = cartState;
  const { userId } = useAuthContext(); // AuthContext에서 사용자 ID 가져오기

  // 주문 및 결제 시작 함수
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
      // 1. 결제 설정 정보 가져오기
      const configResponse = await paymentAPI.getPaymentConfig();
      const paymentConfig = configResponse.data; // Coubee API 응답 구조에 맞춤

      if (!paymentConfig) {
        throw new Error("결제 설정 정보를 불러오지 못했습니다.");
      }

      // 2. 주문 생성에 필요한 데이터 구성
      const orderData = {
        storeId: storeId,
        recipientName: userId, // 임시로 userId 사용, 실제로는 배송지 정보 등이 필요
        paymentMethod: "CARD", // TODO: 결제 수단 선택 UI 추가 필요
        totalAmount: totalSalePrice,
        items: items.map((item) => ({
          productId: item.productId,
          name: item.productName,
          quantity: item.quantity,
          price: item.salePrice, // 할인된 가격으로 주문
        })),
      };

      // 3. 주문 생성 API 호출
      const orderResponse = await paymentAPI.createOrder(orderData);
      const createdOrder = orderResponse.data;

      // 4. 결제 준비 API 호출
      const prepareData = {
        storeId: storeId,
        items: orderData.items,
      };
      await paymentAPI.preparePayment(createdOrder.orderId, prepareData);

      // 5. 결제 화면으로 이동 (주문 정보와 설정 정보를 파라미터로 전달)
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
        <YStack alignItems="center" gap="$3">
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
      </SafeAreaView>

      {/* ProductCheckoutBar의 onPress를 startPaymentFlow 함수로 교체 */}
      <ProductCheckoutBar currentStoreId={storeId} onPress={startPaymentFlow} />

      {/* 로딩 인디케이터 */}
      {isLoading && (
        <YStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
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
