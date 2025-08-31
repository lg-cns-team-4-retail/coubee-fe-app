import React, { useState } from "react";
import { YStack, Button, Text, TextArea, XStack } from "tamagui";
import { Dialog } from "@tamagui/dialog";
import { X } from "@tamagui/lucide-icons";

const CancelOrderModal = ({ isOpen, onClose, onSubmit, isCancelling }) => {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason);
    }
  };

  return (
    <Dialog modal open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          o={0.5}
          enterStyle={{ o: 0 }}
          exitStyle={{ o: 0 }}
        />
        <Dialog.Content
          key="content"
          animation="bouncy"
          w="90%"
          p="$6"
          gap="$4"
          enterStyle={{ y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ y: 10, opacity: 0, scale: 0.95 }}
          elevation={0}
          shadowOpacity={0}
        >
          <YStack gap="$4">
            <Dialog.Title fontSize="$6" fow="bold">
              주문 취소
            </Dialog.Title>
            <Dialog.Description fow={600}>
              주문을 취소하는 사유를 입력해주세요.
            </Dialog.Description>

            <TextArea
              onChangeText={setReason}
              placeholder="예: 단순 변심, 상품 추가 등"
              numberOfLines={4}
              borderColor="$borderColor"
            />

            <XStack gap="$3" jc="flex-end">
              <Dialog.Close asChild>
                <Button bg="grey" color="white" fow="bold" onPress={onClose}>
                  닫기
                </Button>
              </Dialog.Close>
              <Button
                bg="$error"
                color="white"
                fow="bold"
                onPress={handleSubmit}
                disabled={!reason.trim() || isCancelling}
              >
                {isCancelling ? "취소 중..." : "주문 취소하기"}
              </Button>
            </XStack>
          </YStack>

          <Dialog.Close asChild>
            <Button
              pos="absolute"
              t="$3"
              r="$3"
              size="$2"
              chromeless
              icon={X}
              onPress={onClose}
            />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default CancelOrderModal;
