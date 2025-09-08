// components/AppHeader.jsx

import React from "react";
import { YStack, XStack, Text, Button, Image } from "tamagui";
import { ShoppingCart } from "@tamagui/lucide-icons";
import { useAuthContext } from "../app/contexts/AuthContext";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import CoubeeSvgClick from "../components/icons/CoubeeSvgClick";

export default function AppHeader() {
  const { isAuthenticated } = useAuthContext();
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);

  return (
    <SafeAreaView edges={["top"]}>
      <XStack
        paddingHorizontal="$4"
        paddingVertical="$3"
        alignItems="center"
        justifyContent="space-between"
        bg="$background"
        borderBottomWidth={3}
        borderBottomColor="$borderColor"
      >
        <XStack alignItems="center" gap="$3">
          <CoubeeSvgClick />
          <Text color="$color" fontSize="$4" fontWeight="bold">
            쿠비
          </Text>
        </XStack>

        {isAuthenticated ? (
          <Button
            unstyled
            pressStyle={{ opacity: 0.7 }}
            onPress={() => router.push("/checkout")}
          >
            <ShoppingCart color="$color" size={28} />
            {totalQuantity > 0 && (
              <YStack
                position="absolute"
                top={-5}
                right={-5}
                backgroundColor="red"
                borderRadius="$10"
                width={20}
                height={20}
                alignItems="center"
                justifyContent="center"
                borderWidth={1}
                borderColor="white"
              >
                <Text fontSize={12} color="white" fontWeight="bold">
                  {totalQuantity}
                </Text>
              </YStack>
            )}
          </Button>
        ) : (
          <Button
            size="$3"
            bg="$primary"
            color="white"
            fontWeight="bold"
            onPress={() => router.push("/login")}
          >
            로그인
          </Button>
        )}
      </XStack>
    </SafeAreaView>
  );
}
