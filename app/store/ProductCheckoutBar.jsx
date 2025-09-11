import React, { useMemo } from "react";
import { YStack, XStack, Text, Button } from "tamagui";
import { Zap } from "@tamagui/lucide-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CoubeeSvgClick from "../../components/icons/CoubeeSvgClick";
import { useSelector } from "react-redux";
import { useLocalSearchParams, useRouter } from "expo-router";
/**
 * 상품 상세 페이지 등에서 사용하는 하단 주문 바 컴포넌트
 * @param {object} props
 * @param {number} props.salePrice - 현재 판매가
 * @param {number} props.originalPrice - 원래 가격 (취소선으로 표시)
 * @param {number} props.discountAmount - 즉시 할인 금액
 * @param {function} props.onPress - '바로 주문하기' 버튼 클릭 시 실행될 함수
 */
const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "0원";
  return amount.toLocaleString();
};

const ProductCheckoutBar = ({ currentStoreId, onPress }) => {
  const { bottom } = useSafeAreaInsets();

  const {
    items,
    totalOriginPrice,
    totalSalePrice,
    hotdeal,
    totalQuantity,
    storeId,
  } = useSelector((state) => state.cart);

  const paymentDetails = useMemo(() => {
    const itemDiscountAmount = totalOriginPrice - totalSalePrice;

    let hotdealDiscountAmount = 0;
    if (hotdeal && hotdeal.hotdealStatus === "ACTIVE") {
      const calculatedDiscount = totalSalePrice * hotdeal.saleRate;
      hotdealDiscountAmount = Math.min(calculatedDiscount, hotdeal.maxDiscount);
    }

    const finalAmount = totalSalePrice - hotdealDiscountAmount;
    const totalDiscountAmount = itemDiscountAmount + hotdealDiscountAmount;

    return {
      finalAmount,
      totalDiscountAmount,
    };
  }, [totalOriginPrice, totalSalePrice, hotdeal]);

  if (items.length === 0 || Number(storeId) !== Number(currentStoreId)) {
    return null;
  }

  return (
    <XStack
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      backgroundColor="$background"
      paddingVertical="$3"
      paddingHorizontal="$4"
      paddingBottom={bottom || "$3"}
      borderTopWidth={1}
      borderTopColor="$borderColor"
      ai="center"
      jc="space-between"
      elevation={10}
      shadowColor="#000"
      shadowOffset={{ width: 0, height: -2 }}
      shadowOpacity={0.1}
      shadowRadius={5}
    >
      <YStack>
        <XStack alignItems="flex-end" gap="$2">
          <Text fontSize={22} fontWeight="bold">
            {formatCurrency(paymentDetails.finalAmount)}원
          </Text>
          {totalOriginPrice !== totalSalePrice && (
            <Text
              fontSize={15}
              color="$descriptionText"
              textDecorationLine="line-through"
            >
              {formatCurrency(totalOriginPrice)}원
            </Text>
          )}
        </XStack>
        <XStack alignItems="center" space="$1.5" marginTop="$1">
          {totalOriginPrice !== totalSalePrice && (
            <>
              <CoubeeSvgClick fontSize={6} />
              <Text fontSize={14} color="$primary" fontWeight="700">
                {formatCurrency(paymentDetails.totalDiscountAmount)}원 할인!
              </Text>
            </>
          )}
        </XStack>
      </YStack>

      <Button
        backgroundColor="$primary"
        borderRadius="$4"
        height="$4"
        onPress={onPress}
        hoverStyle={{ opacity: 0.9 }}
        pressStyle={{ opacity: 0.8 }}
      >
        <XStack alignItems="center" space="$2.5" paddingHorizontal="$2">
          <YStack
            backgroundColor="$background"
            width={24}
            height={24}
            borderRadius={8}
            alignItems="center"
            justifyContent="center"
          >
            <Text color="$color" fontWeight="bold" fontSize={14}>
              {totalQuantity}
            </Text>
          </YStack>
          <Text color="#fff" fontSize={16} fontWeight="bold">
            주문하기
          </Text>
        </XStack>
      </Button>
    </XStack>
  );
};

export default ProductCheckoutBar;
