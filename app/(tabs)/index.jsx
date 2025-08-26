import { Alert } from "react-native";
import { XStack, YStack, Button, Text, Card } from "tamagui";
import { ToastControl } from "../../components/CurrentToast";
import { getExpoPushToken } from "../services/notifications";
import { useAuthContext } from "../contexts/AuthContext";
import { router } from "expo-router";
import { useLocation } from "../hooks/useLocation";
import { persistor } from "../../redux/store";
import QRCode from "react-native-qrcode-svg";

export default function TabOneScreen() {
  const { logout, userId, isAuthenticated } = useAuthContext();
  const { location, loading, error, getCurrentLocation } = useLocation();

  const handleCopyPushToken = async () => {
    const { AuthService } = await import("../services/auth");
    const [expoToken, storedToken] = await Promise.all([
      getExpoPushToken(),
      AuthService.getPushToken(),
    ]);

    const tokenToCopy = expoToken || storedToken;
    if (tokenToCopy) {
      // 클립보드에 복사하는 기능이 필요하면 expo-clipboard 설치 후 사용
      Alert.alert(
        "푸시 토큰",
        `토큰이 준비되었습니다:\n\n${tokenToCopy}\n\nExpo Push Tool에서 사용하세요!`,
        [{ text: "확인", style: "default" }]
      );
      console.log("=== PUSH TOKEN FOR EXPO TOOL ===");
      console.log(tokenToCopy);
      console.log("=== COPY THIS TOKEN ===");
    } else {
      Alert.alert("오류", "푸시 토큰을 가져올 수 없습니다.");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("성공", "로그아웃되었습니다.");
    } catch (error) {
      Alert.alert("오류", "로그아웃에 실패했습니다.");
    }
  };

  const handlePurge = async () => {
    await persistor.purge();
  };
  const storeId = 1242;
  const storeId2 = 1176;
  const storeId3 = 1276;

  return (
    <YStack flex={1} gap="$8" px="$10" pt="$5" bg="$background">
      <ToastControl />

      <Card padding="$4" width="90%" backgroundColor="$background">
        <YStack gap="$2">
          <Text fontSize="$5" fontWeight="bold">
            위치 정보
          </Text>
          {loading && <Text>위치 정보를 가져오는 중...</Text>}
          {error && <Text color="$red10">{error}</Text>}
          {location && (
            <YStack gap="$1">
              <Text>위도: {location.latitude.toFixed(6)}</Text>
              <Text>경도: {location.longitude.toFixed(6)}</Text>
              {location.accuracy && (
                <Text>정확도: {Math.round(location.accuracy)}m</Text>
              )}
              <Text>시간: {new Date(location.timestamp).toLocaleString()}</Text>
            </YStack>
          )}
          <Button size="$3" onPress={() => getCurrentLocation()}>
            위치 새로고침
          </Button>
        </YStack>
      </Card>

      {isAuthenticated ? (
        <YStack flexWrap="wrap" gap="$4">
          <Text>환영합니다!</Text>
          <Text>사용자명: {userId}</Text>

          <Button onPress={handleCopyPushToken} theme="blue" size="$4">
            푸시 토큰 복사 (Expo Tool용)
          </Button>

          <Button onPress={handleLogout} theme="red" size="$4">
            로그아웃
          </Button>
          <XStack flexWrap="wrap" gap="$1.5">
            <Button
              onPress={() => router.push("/store/1177")}
              theme="blue"
              size="$4"
            >
              가게보기
            </Button>
            <Button
              onPress={() => router.push(`/store/${storeId3}`)}
              theme="blue"
              size="$4"
            >
              {"가게보기" + storeId3}
            </Button>
          </XStack>
        </YStack>
      ) : (
        <XStack flexWrap="wrap" gap="$1.5">
          <Button onPress={() => router.push("/login")} theme="blue" size="$4">
            로그인
          </Button>
          <Button
            onPress={() => router.push(`/store/${storeId}`)}
            theme="blue"
            size="$4"
          >
            가게보기
          </Button>
          <Button
            onPress={() => router.push(`/store/${storeId2}`)}
            theme="blue"
            size="$4"
          >
            가게보기2
          </Button>
          <Button onPress={handlePurge}>초기화</Button>
          <Button
            onPress={() => router.push("/checkout")}
            theme="blue"
            size="$4"
          >
            장바구니
          </Button>
          <Button
            onPress={() => router.push(`/orderDetail/${1144}`)}
            theme="blue"
            size="$4"
          >
            주문내역
          </Button>
        </XStack>
      )}

      <QRCode
        logoSize={300}
        value="https://www.notion.so/4-Honeycomb-225fef49d8d5807dac52ee9bd7ff82bc"
      />
    </YStack>
  );
}
