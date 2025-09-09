import React, { useState, useEffect } from "react";
import { YStack, XStack, Text, Image, Button, Paragraph } from "tamagui";
import { MapPin, Heart } from "@tamagui/lucide-icons";
import { useToastController } from "@tamagui/toast";
import { useToggleInterestMutation } from "../../redux/api/apiSlice";
import { useAuthContext } from "../../app/contexts/AuthContext";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/modalSlice";
import { router } from "expo-router";

export const StoreResult = ({ store, onPress }) => {
  const toast = useToastController();
  const dispatch = useDispatch();
  const [toggleInterest, { isLoading: isToggling }] =
    useToggleInterestMutation();
  const { isAuthenticated } = useAuthContext();

  const [isLiked, setIsLiked] = useState(store.interest);

  useEffect(() => {
    setIsLiked(store.interest);
  }, [store.interest]);

  const handleLikePress = React.useCallback(
    async (e) => {
      e.stopPropagation();
      if (!isAuthenticated) {
        dispatch(
          openModal({
            type: "warning",
            title: "로그인이 필요해요",
            message: "관심 매장 등록은 로그인 이후에 가능하세요",
            confirmText: "로그인 하러 가기",
            cancelText: "취소",
            onConfirm: () => {
              router.replace("/login");
            },
            onCancel: () => {},
          })
        );
      } else {
        // UI를 먼저 업데이트 (낙관적 업데이트)
        const newLikedState = !isLiked;
        setIsLiked(newLikedState);

        try {
          await toggleInterest(store.storeId).unwrap();

          toast.show(
            newLikedState
              ? "관심 가게로 등록했어요."
              : "관심 가게에서 삭제했어요."
          );
        } catch (error) {
          // 에러 발생 시 원래 상태로 복원
          setIsLiked(!newLikedState);
          console.error("관심 가게 변경 실패:", error);
          toast.show("요청에 실패했습니다.", {
            message: "잠시 후 다시 시도해주세요.",
          });
        }
      }
    },
    [isAuthenticated, dispatch, store.storeId, isLiked, toggleInterest, toast]
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
      {/* ... (이하 동일) ... */}
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
              color={isLiked ? "red" : "white"}
              fill={isLiked ? "red" : "transparent"}
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
      {/* ... (이하 동일) ... */}
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

          {store?.distance > 0 && (
            <Text color="green" fontWeight="bold">
              {Math.round(store.distance)}m
            </Text>
          )}

          <Text color="$gray10" numberOfLines={1}>
            {store.storeAddress}
          </Text>
        </XStack>

        {/* 상점 태그 */}
        <XStack flexWrap="wrap" gap="$2" paddingTop="$2">
          {store.storeTag?.slice(0, 3).map((tag) => (
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
