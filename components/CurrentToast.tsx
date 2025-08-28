import { Toast, useToastController, useToastState } from "@tamagui/toast";
import { Button, H4, XStack, YStack, isWeb } from "tamagui";
import { X, CheckCircle, AlertCircle, Info } from "@tamagui/lucide-icons";

export function CurrentToast() {
  const currentToast = useToastState();
  const TOAST_THEMES = {
    success: { Icon: CheckCircle, theme: "green" },
    error: { Icon: X, theme: "red" },
    warning: { Icon: AlertCircle, theme: "orange" },
    info: { Icon: Info, theme: "blue" },
  };

  if (!currentToast || currentToast.isHandledNatively) return null;

  const type = currentToast.customData?.type || "info";
  const { Icon, theme } = TOAST_THEMES[type] || TOAST_THEMES.info;

  return (
    <Toast
      key={currentToast.id}
      duration={1500}
      viewportName={currentToast.viewportName}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={isWeb ? "$12" : 0}
      theme="accent"
      rounded="$6"
      animation="bouncy"
      bg="$primary"
    >
      <YStack alignItems="center" p="$2" gap="$2">
        <Icon color="white" />
        <Toast.Title fontWeight="bold" color="white">
          {currentToast.title}
        </Toast.Title>
        {!!currentToast.message && (
          <Toast.Description color="white" fow={500}>
            {currentToast.message}
          </Toast.Description>
        )}
      </YStack>
    </Toast>
  );
}

export function ToastControl() {
  const toast = useToastController();

  return (
    <YStack gap="$2" alignItems="flex-end">
      <H4>Toast demo</H4>
      <XStack gap="$2" justifyContent="center">
        <Button
          onPress={() => {
            toast.show("Successfully saved!", {
              message: "Don't worry, we've got your data.",
            });
          }}
        >
          Show
        </Button>
        <Button
          onPress={() => {
            toast.hide();
          }}
        >
          Hide
        </Button>
      </XStack>
    </YStack>
  );
}
