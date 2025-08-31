import React from "react";
import { YStack, XStack } from "tamagui";
import Skeleton from "../Skeleton";

export const StoreSkeleton = () => {
  return (
    <YStack
      borderRadius="$6"
      borderWidth={1}
      borderColor="$borderColor"
      marginVertical="$2.5"
      backgroundColor="$cardBg"
      overflow="hidden" // 스켈레톤이 border-radius를 벗어나지 않도록 설정
    >
      <YStack>
        <Skeleton show={true} height={120} width="100%" />
        <YStack
          position="absolute"
          bottom={-40}
          left="$4"
          zIndex={10}
          bg="$background"
          p="$0.5"
          borderRadius={999}
        >
          <Skeleton show={true} height={80} width={80} radius={999} />
        </YStack>
      </YStack>

      {/* 2. 정보 영역 */}
      <YStack padding="$4" gap="$2.5" mt="$6">
        {/* 상점 이름 스켈레톤 */}
        <Skeleton show={true} height={24} width="70%" />

        {/* 상점 설명 스켈레톤 */}
        <YStack gap="$1.5">
          <Skeleton show={true} height={18} width="100%" />
          <Skeleton show={true} height={18} width="80%" />
        </YStack>

        {/* 주소 정보 스켈레톤 */}
        <Skeleton show={true} height={20} width="60%" />

        {/* 상점 태그 스켈레톤 */}
        <XStack flexWrap="wrap" gap="$2" paddingTop="$2">
          <Skeleton show={true} height={28} width={60} radius={999} />
          <Skeleton show={true} height={28} width={70} radius={999} />
          <Skeleton show={true} height={28} width={50} radius={999} />
        </XStack>
      </YStack>
    </YStack>
  );
};

export default StoreSkeleton;
