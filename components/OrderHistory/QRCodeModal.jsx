import React, { useState, useEffect } from "react";
import { YStack, Image, Button, Spinner, Text } from "tamagui";
import { Dialog } from "@tamagui/dialog";
import { X } from "@tamagui/lucide-icons";
import { useSelector, useDispatch } from "react-redux";
import { closeQRCodeModal } from "../../redux/slices/uiSlice";
import axiosInstance from "../../app/services/api";
import { encode as btoa } from "base-64"; // Base64 인코딩을 위함

// ArrayBuffer를 Base64로 변환하는 헬퍼 함수
function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export default function QRCodeModal() {
  const dispatch = useDispatch();
  const { isQRCodeModalVisible, qrCodeOrderId } = useSelector(
    (state) => state.ui
  );

  const [isLoading, setIsLoading] = useState(false);
  const [qrImageData, setQrImageData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 모달이 열리고 orderId가 있을 때만 QR 코드를 가져옵니다.
    if (isQRCodeModalVisible && qrCodeOrderId) {
      const fetchQRCode = async () => {
        setIsLoading(true);
        setQrImageData(null);
        setError(null);
        try {
          const response = await axiosInstance.get(
            `/order/qr/orders/${qrCodeOrderId}`,
            { responseType: "arraybuffer" } // 이미지를 바이너리 데이터로 받습니다.
          );

          const base64 = arrayBufferToBase64(response.data);
          setQrImageData(`data:image/png;base64,${base64}`);
        } catch (err) {
          console.error("QR 코드 로딩 실패:", err);
          setError("QR 코드를 불러오는 데 실패했습니다.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchQRCode();
    }
  }, [isQRCodeModalVisible, qrCodeOrderId]);

  const handleClose = () => {
    dispatch(closeQRCodeModal());
  };

  return (
    <Dialog modal open={isQRCodeModalVisible} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="quick"
          o={0.5}
          enterStyle={{ o: 0 }}
          exitStyle={{ o: 0 }}
        />
        <Dialog.Content
          animation="bouncy"
          key="content"
          enterStyle={{ y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ y: 10, opacity: 0, scale: 0.95 }}
          w="90%"
          p="$6"
          gap="$4"
          elevation={0}
          shadowOpacity={0}
        >
          <YStack ai="center" gap="$4">
            <Dialog.Title fontSize="$6" fow="bold">
              픽업 QR 코드
            </Dialog.Title>

            {isLoading && <Spinner size="large" my="$4" />}
            {error && !isLoading && <Text color="red">{error}</Text>}
            {qrImageData && !isLoading && (
              <Image source={{ uri: qrImageData }} w={250} h={250} />
            )}

            <Dialog.Description fow={600}>
              매장 직원에게 이 QR 코드를 보여주세요.
            </Dialog.Description>
          </YStack>

          <Dialog.Close asChild>
            <Button
              pos="absolute"
              t="$3"
              r="$3"
              size="$2"
              circular
              icon={X}
              onPress={handleClose}
            />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}
