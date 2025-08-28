import React, { useState } from "react";
import { YStack, XStack, Text, Image, Button, Paragraph } from "tamagui";
import { MapPin } from "@tamagui/lucide-icons";
import backgroundImg from "../../assets/images/background.jpg";
import profileImg from "../../assets/images/peach.png";
// 새로운 디자인의 상점 리스트 아이템 컴포넌트
export const StoreResult = ({ store, onPress }) => {
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
