import React from "react";

import { Button, Dialog, Paragraph, XStack, Text } from "tamagui";

import { useSelector, useDispatch } from "react-redux";

import { closeModal, selectOnConfirm } from "../redux/slices/modalSlice";

const GlobalModal = () => {
  const dispatch = useDispatch();

  const { isOpen, title, message } = useSelector((state) => state.modal);

  const onConfirmAction = useSelector(selectOnConfirm);

  const handleConfirm = () => {
    if (typeof onConfirmAction === "function") {
      onConfirmAction();
    }

    dispatch(closeModal());
  };

  const handleCancel = () => {
    dispatch(closeModal());
  };

  return (
    <Dialog modal open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          o={0.5}
          enterStyle={{ o: 0 }}
          exitStyle={{ o: 0 }}
        />

        <Dialog.Content
          bordered
          elevate
          key="content"
          animation={[
            "quick",

            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          w="90%"
        >
          <Text fos="$5">{title}</Text>

          <Text fos="$3">{message}</Text>

          <XStack alignSelf="flex-end" gap="$2" marginTop="$4">
            <Button
              size="$3"
              bg="$primary"
              color="#fff"
              fow={700}
              onPress={handleConfirm}
            >
              확인
            </Button>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

export default GlobalModal;
