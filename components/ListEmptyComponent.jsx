// components/ListEmptyComponent.js

import React from "react";
import { YStack, Text } from "tamagui";
import { PackageX } from "@tamagui/lucide-icons"; // 아이콘 추가

export default function ListEmptyComponent({ message }) {
  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$8">
      <PackageX size={48} color="$color" />
      <Text fontSize="$4" color="$color" marginTop="$4">
        {message}
      </Text>
    </YStack>
  );
}
