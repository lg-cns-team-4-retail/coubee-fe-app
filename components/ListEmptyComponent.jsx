// components/ListEmptyComponent.js

import React from "react";
import { YStack, Text, ShoppingCart } from "tamagui"; // 👈 아이콘은 원하는 것으로 변경 가능

export default function ListEmptyComponent({ message }) {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$8">
      <ShoppingCart size={48} color="$gray8" />
      <Text fontSize="$6" color="$gray10" marginTop="$4">
        {message}
      </Text>
    </YStack>
  );
}
