// 예: stores/SomeStoreScreen.js

import React, { useState, useEffect } from "react";
import { XStack, YStack, ScrollView, Spinner } from "tamagui";
import { FlatList } from "react-native";
import ProductItem from "../../components/ProductItem";
import HorizontalProductItem from "../../components/HorizontalProductItem";
import { fetchProducts, clearProducts } from "../../redux/slices/productSlice";
import { useSelector, useDispatch } from "react-redux";

const ProductItemSection = () => {
  const dispatch = useDispatch();
  const { products, loading, error, currentPage, isLastPage } = useSelector(
    (state) => state.productStore
  );

  useEffect(() => {
    dispatch(clearProducts());
    dispatch(fetchProducts({ storeId: 1177, page: 0, size: 5 }));
  }, [dispatch]);

  const handlePress = () => {
    console.log("메롱");
  };

  const loadMoreProducts = () => {
    if (loading !== "pending" && !isLastPage) {
      dispatch(fetchProducts({ storeId: 1177, page: currentPage + 1 }));
    }
  };

  return (
    <YStack>
      <FlatList
        data={products}
        nestedScrollEnabled
        keyExtractor={(item) => item.productId.toString()}
        renderItem={({ item }) => (
          <HorizontalProductItem
            item={item}
            loading={loading === "pending" ? true : false}
            onPress={() => {
              handlePress();
            }}
          />
        )}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading === "pending" ? (
            <YStack p="$4" ai="center">
              <Spinner />
            </YStack>
          ) : null
        }
      />
    </YStack>
  );
};

export default ProductItemSection;
