import {
  YStack,
  XStack,
  Text,
  H3,
  Separator,
  Card,
  Spinner,
  Paragraph,
} from "tamagui";
import { ShoppingCart, Tag, CheckCircle2 } from "@tamagui/lucide-icons";
import CoubeeSvgClick from "../components/icons/CoubeeSvgClick";
import { useAuthContext } from "../app/contexts/AuthContext";
const formatCurrency = (amount) => {
  if (typeof amount !== "number") return "0원";
  return `${amount.toLocaleString()}원`;
};

export function PurchaseSummaryCard({ data, isLoading }) {
  const { isAuthenticated, nickname } = useAuthContext();
  if (isLoading || !data) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner />
      </YStack>
    );
  }

  const {
    totalOrderCount,
    totalOriginalAmount,
    totalDiscountAmount,
    finalPurchaseAmount,
  } = data;

  return (
    <>
      <XStack px="$4" justifyContent="space-between" alignItems="center">
        {/* 왼쪽: 텍스트 영역 */}
        <YStack>
          <Paragraph size="$8" fontWeight="bold">
            <Text color="$info">{isAuthenticated ? nickname : "사용자"}</Text>
            님이
          </Paragraph>
          <Paragraph size="$8" fontWeight="bold" color="$gray11">
            받으신 혜택이에요
          </Paragraph>
        </YStack>
      </XStack>
      <Card bordered padding="$5" animation="bouncy">
        <YStack gap="$4">
          {/* 카드 제목 */}
          <XStack gap="$3" alignItems="center">
            <CoubeeSvgClick width={24} height={24} />
            <H3 color="$color" fontFamily="$body" fow="bold">
              쿠비 혜택
            </H3>
          </XStack>

          <Separator borderColor="gray" />
          <YStack
            alignItems="center"
            gap="$2"
            paddingVertical="$2"
            backgroundColor="$blue3"
            borderRadius="$4"
          >
            {totalDiscountAmount <= 0 ? (
              <>
                <Text fontSize="$4" color="$blue11" fontWeight="600">
                  쿠비로 절약한 금액이 아직 없어요
                </Text>
              </>
            ) : (
              <>
                <Text fontSize="$4" color="$blue11" fontWeight="600">
                  쿠비로 절약한 금액
                </Text>
                <Text fontSize="$6" fontWeight="bold" color="$info">
                  {formatCurrency(totalDiscountAmount)}
                </Text>
              </>
            )}
          </YStack>

          <YStack gap="$3">
            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$3" color="gray">
                전체 구매 금액
              </Text>
              <Text fontSize="$3" color="gray" fontWeight="500">
                {formatCurrency(totalOriginalAmount)}
              </Text>
            </XStack>

            <XStack justifyContent="space-between" alignItems="center">
              <Text fontSize="$3" color="gray">
                최종 구매 금액
              </Text>
              <Text fontSize="$4" color="gray" fontWeight="500">
                {formatCurrency(finalPurchaseAmount)}
              </Text>
            </XStack>
          </YStack>

          <Separator borderColor="gray" />

          <XStack justifyContent="space-between" alignItems="center">
            <XStack gap="$3" alignItems="center">
              <CheckCircle2 color="green" />
              <Text fontSize="$4" fontWeight="bold" color="green">
                총 주문 건수
              </Text>
            </XStack>
            <Text fontSize="$4" fontWeight="bold">
              {totalOrderCount}건
            </Text>
          </XStack>
        </YStack>
      </Card>
    </>
  );
}
