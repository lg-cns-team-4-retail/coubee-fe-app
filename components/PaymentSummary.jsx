// components/PaymentSummary.jsx

import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { YStack, XStack, Text, H3, Separator, Card } from "tamagui";

// 숫자 포맷팅을 위한 헬퍼 함수 (예: 100000 -> 100,000원)
const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "0원";
  return `${amount.toLocaleString()}원`;
};

// 결제 정보 한 줄을 표시하는 행 컴포넌트
const SummaryRow = ({
  label,
  value,
  valueColor = "$color",
  isBold = false,
}) => (
  <XStack justifyContent="space-between" alignItems="center">
    <Text fontSize={16} color="$gray11">
      {label}
    </Text>
    <Text
      fontSize={16}
      color={valueColor}
      fontWeight={isBold ? "bold" : "normal"}
    >
      {value}
    </Text>
  </XStack>
);

export function PaymentSummary() {
  // Redux store에서 cart 상태를 가져옵니다.
  const { totalOriginPrice, totalSalePrice, hotdeal } = useSelector(
    (state) => state.cart
  );

  // useMemo를 사용하여 렌더링 시 불필요한 재계산을 방지합니다.
  const paymentDetails = useMemo(() => {
    // 1. 개별 물품 할인액 계산
    const itemDiscountAmount = totalOriginPrice - totalSalePrice;

    // 2. 가게 핫딜 할인액 계산 (최대 할인 금액 적용)
    let hotdealDiscountAmount = 0;
    if (hotdeal && hotdeal.hotdealStatus === "ACTIVE") {
      const calculatedDiscount = totalSalePrice * hotdeal.saleRate;
      hotdealDiscountAmount = Math.min(calculatedDiscount, hotdeal.maxDiscount);
    }

    // 3. 최종 결제 금액 계산
    const finalAmount = totalSalePrice - hotdealDiscountAmount;

    // 4. 총 할인율 계산
    const totalDiscountAmount = itemDiscountAmount + hotdealDiscountAmount;
    const totalDiscountRate =
      totalOriginPrice > 0
        ? Math.round((totalDiscountAmount / totalOriginPrice) * 100)
        : 0;

    return {
      itemDiscountAmount,
      hotdealDiscountAmount,
      finalAmount,
      totalDiscountRate,
    };
  }, [totalOriginPrice, totalSalePrice, hotdeal]);

  return (
    <Card bg="$cardBg" bordered padding="$5" animation="bouncy" width="90%">
      <YStack gap="$4">
        <Text fos="$5" fow="bold">
          결제 금액
        </Text>
        <Separator />

        <SummaryRow
          label="총 상품 가격"
          value={formatCurrency(totalOriginPrice)}
        />
        <SummaryRow
          label="상품 할인"
          value={`-${formatCurrency(paymentDetails.itemDiscountAmount)}`}
          valueColor="red"
        />
        {paymentDetails.hotdealDiscountAmount > 0 && (
          <SummaryRow
            label="프로모션 핫딜"
            value={`-${formatCurrency(paymentDetails.hotdealDiscountAmount)}`}
            valueColor="red"
          />
        )}

        <Separator />

        <XStack justifyContent="space-between" alignItems="center" mt="$2">
          <Text fontSize={18} fow="bold">
            최종 결제 금액
          </Text>
          <XStack gap="$3" alignItems="center">
            <Text fontSize={18} fontWeight="bold" color="red">
              {paymentDetails.totalDiscountRate}%
            </Text>
            <Text fontSize={22} fontWeight="bold">
              {formatCurrency(paymentDetails.finalAmount)}
            </Text>
          </XStack>
        </XStack>
      </YStack>
    </Card>
  );
}
