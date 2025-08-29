// app/checkout/PaymentScreen.jsx

import React from "react";
import { SafeAreaView, Alert } from "react-native";
import { Payment } from "@portone/react-native-sdk";
import { Spinner, YStack } from "tamagui";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice";
import { useToastController } from "@tamagui/toast";

// PortOne 결제수단 문자열로 변환
const getPortOnePayMethod = (method) => {
  const payMethodMap = {
    CARD: "CARD",
    KAKAOPAY: "EASY_PAY",
    TOSSPAY: "EASY_PAY",
  };
  return payMethodMap[method] || "CARD";
};

export default function PaymentScreen() {
  const toast = useToastController();

  const dispatch = useDispatch();
  // checkout 페이지에서 navigate 하며 전달한 파라미터를 받습니다.
  const { paymentInfo, paymentConfig } = useLocalSearchParams();
  console.log(paymentInfo, "pay info detail");
  // 전달된 파라미터가 없거나, JSON 파싱에 실패하면 이전 화면으로 돌려보냅니다.
  if (!paymentInfo || !paymentConfig) {
    Alert.alert("오류", "결제 정보가 올바르지 않습니다.", [
      { text: "확인", onPress: () => router.back() },
    ]);
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner />
      </YStack>
    );
  }

  const parsedPaymentInfo = JSON.parse(paymentInfo);
  const parsedPaymentConfig = JSON.parse(paymentConfig);
  const channelKey =
    parsedPaymentConfig.channelKeys?.[
      parsedPaymentInfo.paymentMethod.toLowerCase()
    ];

  // 결제 완료 처리
  const handlePaymentComplete = (response) => {
    console.log(response.paymentId, "check from the code ");
    if (response.code != null) {
      toast.show("결제 실패", {
        message: response.message || "결제 실패하셨습니다",
      });
      router.replace("/checkout");
    } else {
      dispatch(clearCart()); // 결제 성공 시 장바구니 비우기
      toast.show("결제 성공", {
        message: "픽업 받으실 때 까지 쿠비가 최선을 다할게요! ",
      });
      router.replace(`/orderDetail/${response.paymentId}`);
    }
  };

  // 결제 오류 처리
  const handlePaymentError = (error) => {
    toast.show("결제 실패", {
      message: error.message,
    });
    router.replace("/checkout");
  };

  if (!channelKey) {
    Alert.alert("오류", "유효하지 않은 결제 채널입니다.", [
      { text: "확인", onPress: () => router.replace("/checkout") },
    ]);
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Payment
        request={{
          storeId: parsedPaymentConfig.storeId,
          channelKey: channelKey,
          paymentId: parsedPaymentInfo.paymentId,
          orderName: parsedPaymentInfo.orderName,
          totalAmount: parsedPaymentInfo.amount,
          currency: "KRW",
          payMethod: getPortOnePayMethod(parsedPaymentInfo.paymentMethod),
          appScheme: "coubee",
          customer: {
            // TODO: 실제 고객 정보로 변경 필요
            fullName: "테스트 고객",
            phoneNumber: "010-1234-5678",
            email: "test@example.com",
          },
        }}
        onComplete={handlePaymentComplete}
        onError={handlePaymentError}
      />
    </SafeAreaView>
  );
}
