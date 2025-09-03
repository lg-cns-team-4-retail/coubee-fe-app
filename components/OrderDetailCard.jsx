import React, { useState } from "react";
import { YStack, XStack, Text, Image, Pressable, Button } from "tamagui"; // 'Paragraph' 제거
import { ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import OrderStatusTracker from "./OrderStatusTracker";
import OrderStoreInfoCard from "./OrderStoreInfoCard";
import KakaoMap from "./KakaoMap";
import { useDispatch } from "react-redux";
import { openQRCodeModal } from "../redux/slices/uiSlice";
import { useCancelOrderMutation } from "../redux/api/apiSlice";
import CancelOrderModal from "./OrderHistory/CancelOrderModal";
import { useToastController } from "@tamagui/toast";

const PriceRow = ({ label, amount, isTotal = false, color = "$color" }) => (
  <XStack justifyContent="space-between" alignItems="center">
    <Text
      fontSize={isTotal ? "$4" : "$3"}
      color={isTotal ? "$color" : "$gray"}
      fontWeight={isTotal ? "bold" : "normal"}
    >
      {label}
    </Text>
    <Text
      fontSize={isTotal ? "$4" : "$3"}
      color={color}
      fontWeight={isTotal ? "bold" : "normal"}
    >
      {amount.toLocaleString()}원
    </Text>
  </XStack>
);

const OrderDetailCard = ({
  order,
  statusHistory,
  isExpanded,
  onExpandChange,
  isLoading,
  isFetching,
}) => {
  const dispatch = useDispatch();

  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const toast = useToastController();
  const handleShowQRCode = () => {
    dispatch(openQRCodeModal(order.orderId));
  };

  // 3. 주문 취소 핸들러가 'reason'을 인자로 받도록 수정합니다.
  const handleCancelOrder = async (reason) => {
    try {
      await cancelOrder({ orderId: order.orderId, reason }).unwrap();
      toast.show("주문이 성공적으로 취소되었습니다.");
      setIsCancelModalOpen(false); // 성공 시 모달 닫기
    } catch (error) {
      toast.show("주문 취소에 실패했습니다.", {
        message: "다시 시도해주세요.",
      });
      console.error("Failed to cancel order: ", error);
    }
  };

  // 주문 취소 버튼을 보여줄지 결정하는 변수
  const canCancel = ["PAID", "PREPARING"].includes(order?.status);

  return (
    <YStack gap="$1" p="$3" m="$3" borderRadius="$6">
      {/* 주문 상태 */}
      <OrderStatusTracker
        currentStatus={order?.status}
        statusHistory={statusHistory}
        isLoading={isLoading}
        isFetching={isFetching}
      />

      <KakaoMap
        latitude={37.559661293097975}
        longitude={127.0053580437816}
        height={350}
      />

      {/* 구분선 */}
      <YStack borderBottomWidth={1} borderColor="$borderColor" />

      {/* 상점 정보 */}
      <OrderStoreInfoCard
        store={order?.store}
        product={order?.items}
        isExpanded={isExpanded}
        onExpandChange={onExpandChange}
      />

      <YStack
        borderRadius="$6"
        borderWidth={1}
        bg="$cardBg"
        borderColor="$borderColor"
        gap="$2"
        padding="$4"
      >
        <Text fontSize="$5" fontWeight="bold" mb="$2">
          결제 금액
        </Text>
        <PriceRow label="총 상품 가격" amount={order?.originalAmount || 0} />
        {(order?.discountAmount || 0) > 0 && (
          <PriceRow
            label="프로모션 핫딜"
            amount={-(order?.discountAmount || 0)}
            color="red"
          />
        )}
        <YStack borderBottomWidth={1} borderColor="$borderColor" my="$2" />
        <PriceRow
          label="최종 결제 금액"
          amount={order?.totalAmount || 0}
          isTotal={true}
        />
      </YStack>

      {order?.status === "PREPARED" && (
        <Button
          mt="$2"
          bg="$primary"
          color="white"
          fontWeight="bold"
          size="$5"
          onPress={handleShowQRCode}
        >
          픽업 코드 보기
        </Button>
      )}

      {canCancel && (
        <Button
          mt="$2"
          variant="outlined"
          bg="$error"
          color="white"
          fontWeight="bold"
          size="$5"
          // 4. 버튼 클릭 시, 직접 만든 모달을 열도록 변경합니다.
          onPress={() => setIsCancelModalOpen(true)}
          disabled={isCancelling}
        >
          {isCancelling ? "취소 중..." : "주문 취소"}
        </Button>
      )}

      <CancelOrderModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onSubmit={handleCancelOrder}
        isCancelling={isCancelling}
      />
    </YStack>
  );
};

export default OrderDetailCard;
