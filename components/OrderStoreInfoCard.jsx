import React, { useState } from "react";
import { YStack, XStack, Text, Image, Button } from "tamagui";
import { ChevronDown, ChevronUp, Phone } from "@tamagui/lucide-icons";
import PhoneLink from "./PhoneLink";

const OrderStoreInfoCard = ({ store, product, isExpanded, onExpandChange }) => {
  const OrderProductItem = ({ product }) => (
    <>
      <XStack p="$3" ai="center" gap="$3">
        <Image
          source={{
            uri:
              product.product.productImg || "https://via.placeholder.com/100",
          }}
          width={60}
          height={60}
          borderRadius="$4"
        />
        <YStack f={1}>
          <Text fontWeight="bold">{product.productName}</Text>
          <Text color="$gray10">수량: {product.quantity}개</Text>
        </YStack>
        <Text fontWeight="bold">
          {(product.product.salePrice * product.quantity).toLocaleString()}원
        </Text>
      </XStack>
      <YStack borderBottomWidth={2} borderColor="$borderColor" />
    </>
  );

  const previewItemTitle =
    product.length === 1
      ? product[0].productName
      : `${product[0].productName} 외 ${product.length - 1}건`;

  return (
    <>
      <YStack
        borderRadius="$6"
        borderWidth={1}
        borderColor="$borderColor"
        marginVertical="$2.5"
        backgroundColor="$cardBg"
      >
        <YStack padding="$4">
          <XStack gap="$3" ai="center">
            <Image
              source={{
                uri: store.profileImg || "https://via.placeholder.com/400x150",
              }}
              h={35}
              br={8}
              w={35}
            />
            <YStack f={1}>
              <Text fontSize="$4" fontWeight="bold" numberOfLines={1}>
                {store.storeName}
              </Text>
              <Text color="gray" fontSize="$3">
                {store.storeAddress}
              </Text>
            </YStack>
          </XStack>
        </YStack>

        {!isExpanded && (
          <>
            <YStack mx="$5" borderBottomWidth={2} borderColor="$borderColor" />
            <XStack px="$3" mx="$4" my="$5" ai="center">
              <Image
                source={{
                  uri:
                    product[0].product.productImg ||
                    "https://via.placeholder.com/100",
                }}
                width={60}
                height={60}
                borderRadius="$4"
              />

              <YStack f={1}>
                <Text mx="$3">{previewItemTitle}</Text>
                <Text mx="$3">수량: {product[0].quantity}개</Text>
              </YStack>
            </XStack>
            <YStack
              mx="$5"
              mb="$3"
              borderBottomWidth={2}
              borderColor="$borderColor"
            />
          </>
        )}
        {isExpanded && (
          <YStack
            px="$5"
            py="$3"
            animation="bouncy"
            gap="$3"
            enterStyle={{ opacity: 0, y: -10 }}
            exitStyle={{ opacity: 0, y: -10 }}
          >
            <YStack>
              <Text fontSize="$4" mb="$2">
                가게 설명
              </Text>
              <Text fontSize="$4" color="grey" fow="bold">
                {store.description}
              </Text>
            </YStack>
            <YStack borderBottomWidth={2} borderColor="$borderColor" />
            <YStack>
              <Text fontSize="$4" mb="$2">
                가게 위치
              </Text>
              <Text fontSize="$4" color="grey" fow="bold">
                {store.storeAddress}
              </Text>
            </YStack>
            <YStack borderBottomWidth={2} borderColor="$borderColor" />
            <YStack>
              <Text fontSize="$4" mb="$2">
                연락처
              </Text>
              <PhoneLink phoneNumber={store.contactNo} />
            </YStack>
            <YStack borderBottomWidth={2} borderColor="$borderColor" />
            <YStack>
              <Text fontSize="$4" mb="$2">
                운영 시간
              </Text>
              <Text fontSize="$4" color="grey" fow="bold">
                {store.workingHour}
              </Text>
            </YStack>
            <YStack borderBottomWidth={2} borderColor="$borderColor" />
            <YStack>
              <Text fontSize="$4" mb="$2">
                구매 물품
              </Text>
              {product.map((item) => (
                <OrderProductItem key={item.productId} product={item} />
              ))}
            </YStack>
          </YStack>
        )}

        <Button chromeless onPress={() => onExpandChange(!isExpanded)}>
          <YStack ai="center" py="$2">
            {isExpanded ? (
              <ChevronUp color="$gray10" />
            ) : (
              <ChevronDown color="$gray10" />
            )}
          </YStack>
        </Button>
      </YStack>
    </>
  );
};

export default OrderStoreInfoCard;
