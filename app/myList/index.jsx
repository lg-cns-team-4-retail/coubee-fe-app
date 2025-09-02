// app/my-lists.jsx
import React, { useState } from "react";
import { FlatList } from "react-native";
import { YStack, Spinner, Text, XStack, Button } from "tamagui";
import {
  useGetRecommendedProductQuery,
  useGetInterestStoreQuery,
} from "../../redux/api/apiSlice";
import HorizontalProductItem from "../../components/HorizontalProductItem";
import StoreResult from "../../components/storeSearch/StoreResult";
import { ChevronLeft } from "@tamagui/lucide-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

const ListTabs = ({ activeTab, setActiveTab }) => {
  return (
    <XStack p="$2" alignSelf="center" bg="$backgroundPress" borderRadius="$10">
      <Button
        theme={activeTab === "stores" ? "active" : null}
        backgroundColor={activeTab === "stores" ? "$primary" : "transparent"}
        borderRadius="$8"
        onPress={() => setActiveTab("stores")}
        animation="bouncy"
        chromeless
      >
        <Text
          fontWeight={activeTab === "stores" ? "bold" : "normal"}
          color={activeTab === "stores" ? "white" : "$gray11"}
        >
          관심 매장
        </Text>
      </Button>
      <Button
        theme={activeTab === "products" ? "active" : null}
        backgroundColor={activeTab === "products" ? "$primary" : "transparent"}
        borderRadius="$8"
        onPress={() => setActiveTab("products")}
        animation="bouncy"
        chromeless
      >
        <Text
          fontWeight={activeTab === "products" ? "bold" : "normal"}
          color={activeTab === "products" ? "white" : "$gray11"}
        >
          추천 상품
        </Text>
      </Button>
    </XStack>
  );
};

export default function MyListsScreen() {
  const { initialTab } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState(initialTab || "stores");

  const { data: stores, isLoading: isStoresLoading } =
    useGetInterestStoreQuery();
  const { data: products, isLoading: isProductsLoading } =
    useGetRecommendedProductQuery();

  const renderStoreItem = ({ item }) => (
    <YStack width="100%" mb="$3">
      <StoreResult
        store={item}
        onPress={() => router.push(`/store/${item.storeId}`)}
      />
    </YStack>
  );

  const renderProductItem = ({ item }) => {
    const cleanedItem = {
      ...item,
      productImg: item.productImg.split("\r\n")[0].trim(),
    };
    return (
      <YStack width="100%" mb="$3">
        <HorizontalProductItem
          item={cleanedItem}
          onPress={() => router.push(`/productView/${item.productId}`)}
        />
      </YStack>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
      <YStack flex={1} bg="$background">
        <XStack
          py="$2"
          px="$2"
          ai="center"
          borderBottomWidth={1}
          borderColor="$borderColor"
          jc="center"
        >
          <Button
            chromeless
            icon={ChevronLeft}
            onPress={() => router.back()}
            size="$5"
            position="absolute"
            left="$2"
            zIndex={1}
          />
          <ListTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </XStack>

        {activeTab === "stores" ? (
          isStoresLoading ? (
            <Spinner mt="$4" />
          ) : (
            <FlatList
              data={stores}
              renderItem={renderStoreItem}
              keyExtractor={(item) => item.storeId.toString()}
              contentContainerStyle={{ padding: 16 }}
            />
          )
        ) : isProductsLoading ? (
          <Spinner mt="$4" />
        ) : (
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.productId.toString()}
            contentContainerStyle={{ padding: 16 }}
          />
        )}
      </YStack>
    </SafeAreaView>
  );
}
