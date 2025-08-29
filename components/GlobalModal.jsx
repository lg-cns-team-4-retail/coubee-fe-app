// components/GlobalModal.jsx

import React from "react";
import { Button, Dialog, Paragraph, XStack, YStack, Text } from "tamagui";
import { useSelector, useDispatch } from "react-redux";
import { CheckCircle, XCircle, AlertTriangle } from "@tamagui/lucide-icons"; // 아이콘 추가
import { closeModal, selectOnConfirm } from "../redux/slices/modalSlice";

// 모달의 유형에 따라 아이콘과 색상을 결정하는 헬퍼 객체
const MODAL_THEMES = {
  success: { Icon: CheckCircle, color: "$green10" },
  error: { Icon: XCircle, color: "$red10" },
  warning: { Icon: AlertTriangle, color: "$orange10" },
  default: { Icon: AlertTriangle, color: "$blue10" },
};

const GlobalModal = () => {
  const dispatch = useDispatch();
  const {
    isOpen,
    title,
    message,
    type = "default", // success, error, warning
    onCancel,
    confirmText = "확인",
    cancelText = "취소",
  } = useSelector((state) => state.modal);

  const onConfirmAction = useSelector(selectOnConfirm);

  const { Icon, color } = MODAL_THEMES[type] || MODAL_THEMES.default;

  const handleConfirm = () => {
    if (typeof onConfirmAction === "function") {
      onConfirmAction();
    }
    dispatch(closeModal());
  };

  const handleCancel = () => {
    if (typeof onCancel === "function") {
      onCancel();
    }
    dispatch(closeModal());
  };

  return (
    <Dialog modal open={isOpen} onOpenChange={() => dispatch(closeModal())}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          enterStyle={{ o: 0 }}
          exitStyle={{ o: 0 }}
        />
        <Dialog.Content
          bordered
          key="content"
          animation="bouncy"
          enterStyle={{ y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ y: 10, opacity: 0, scale: 0.95 }}
          w="70%"
          br="$6"
        >
          <YStack gap="$4" ai="center" py="$2">
            <Icon size={48} color={color} />

            <Dialog.Title fontSize="$6" fontWeight="bold" textAlign="center">
              {title}
            </Dialog.Title>

            <Dialog.Description
              fontSize="$4"
              color="$gray10"
              fontWeight={500}
              textAlign="center"
            >
              {message}
            </Dialog.Description>

            <XStack w="100%" gap="$3" pt="$2">
              {onCancel && (
                <Button
                  f={1}
                  size="$4"
                  variant="outlined"
                  onPress={handleCancel}
                >
                  {cancelText}
                </Button>
              )}
              <Button
                f={1}
                size="$4"
                bg="$primary"
                color="white"
                fontWeight="bold"
                onPress={handleConfirm}
              >
                {confirmText}
              </Button>
            </XStack>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default GlobalModal;
