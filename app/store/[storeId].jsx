import { useLocalSearchParams } from "expo-router";
import { Text, YStack } from "tamagui";

export default function StoreDetailPage() {
  // 1. useLocalSearchParams 훅을 사용하여 URL의 동적 파라미터를 가져옵니다.
  // 파일명이 [id].tsx 이므로, id 라는 키로 값을 가져올 수 있습니다.
  const { storeId } = useLocalSearchParams();

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" space>
      <Text fontSize="$8" fontWeight="bold">
        상점 상세 정보
      </Text>
      <Text fontSize="$6">
        현재 보고 계신 상점의 고유 ID는 "{storeId}" 입니다.
      </Text>
      {/* 이 id를 사용하여 해당 상점의 상세 정보를 API로 불러올 수 있습니다. */}
    </YStack>
  );
}
