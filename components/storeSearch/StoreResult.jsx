import React, { useState } from "react";
import { YStack, XStack, Text, Image, Button, Paragraph } from "tamagui";
import { MapPin, Heart } from "@tamagui/lucide-icons";
import { useToastController } from "@tamagui/toast";
import { useToggleInterestMutation } from "../../redux/api/apiSlice";
export const StoreResult = ({ store, onPress }) => {
  const toast = useToastController();
  const [toggleInterest, { isLoading: isToggling }] =
    useToggleInterestMutation();

  const handleLikePress = React.useCallback(
    async (e) => {
      e.stopPropagation(); // 카드 전체가 눌리는 것을 방지

      const isCurrentlyLiked = store.interest;

      try {
        // API 요청 후 성공 또는 실패를 기다립니다.
        await toggleInterest(store.storeId).unwrap();

        // 성공 시, 현재 상태에 따라 적절한 메시지를 보여줍니다.
        toast.show(
          isCurrentlyLiked
            ? "관심 가게에서 삭제했어요."
            : "관심 가게로 등록했어요."
        );
      } catch (error) {
        // 실패 시, 에러 메시지를 보여줍니다.
        console.error("관심 가게 변경 실패:", error);
        toast.show("요청에 실패했습니다.", {
          message: "잠시 후 다시 시도해주세요.",
        });
      }
    },
    [store.storeId, store.interest, toggleInterest, toast]
  );

  return (
    <YStack
      borderRadius="$6"
      borderWidth={1}
      onPress={onPress}
      borderColor="$borderColor"
      marginVertical="$2.5"
      backgroundColor="$cardBg"
      pressStyle={{ scale: 0.985 }}
      animation="bouncy"
    >
      {/* 1. 이미지 영역 (배경 + 프로필) */}
      <YStack position="relative">
        <Image
          source={{
            uri: store.backImg || "https://via.placeholder.com/400x150",
          }}
          height={120}
          width="100%"
          borderTopLeftRadius="$6"
          borderTopRightRadius="$6"
        />

        <Button
          position="absolute"
          top="$3"
          right="$3"
          size="$3"
          circular
          backgroundColor="rgba(0, 0, 0, 0.4)"
          pressStyle={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          onPress={handleLikePress}
          disabled={isToggling}
          icon={
            <Heart
              size={20}
              color={store.interest ? "red" : "white"}
              fill={store.interest ? "red" : "transparent"}
            />
          }
        />

        <Image
          source={{
            uri: store.profileImg || "https://via.placeholder.com/100",
          }}
          width={80}
          height={80}
          borderRadius={999}
          borderWidth={3}
          borderColor="$background"
          position="absolute"
          bottom={-40}
          left="$4"
          zIndex={10}
        />
      </YStack>

      {/* 2. 정보 영역 */}
      <YStack padding="$4" gap="$2.5" mt="$6">
        <Text fontSize="$4" fontWeight="bold" numberOfLines={1}>
          {store.storeName}
        </Text>

        {/* 상점 설명 */}
        <Text fontSize="$3" numberOfLines={2}>
          {store.description}
        </Text>

        {/* 주소 정보 */}
        <XStack alignItems="center" gap="$2">
          <MapPin size={16} color="$gray10" />
          <Text color="$green10" fontWeight="bold">
            {Math.round(store.distance)}m
          </Text>
          <Text color="$gray10" numberOfLines={1}>
            {store.storeAddress}
          </Text>
        </XStack>

        {/* 상점 태그 */}
        <XStack flexWrap="wrap" gap="$2" paddingTop="$2">
          {store.storeTag.slice(0, 3).map((tag) => (
            <Button
              key={tag.categoryId}
              size="$2"
              borderRadius="$10"
              color="white"
              backgroundColor="$primary"
              disabled
            >
              <Text fontSize="$3" fow="bold" color="white">
                {tag.name}
              </Text>
            </Button>
          ))}
        </XStack>
      </YStack>
    </YStack>
  );
};

export default StoreResult;
