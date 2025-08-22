import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Button,
} from "react-native";
import { useGetProductsQuery } from "../redux/api/apiSlice";

const ProductListExample = ({ storeId }) => {
  const [page, setPage] = useState(0);

  const {
    data: productData,
    error,
    isLoading,
    isFetching,
  } = useGetProductsQuery(
    { storeId, page, size: 10 },
    {
      // skip fetching if storeId is not available yet
      skip: !storeId,
    }
  );

  // Memoize the flattened list of products
  const products = useMemo(
    () => productData?.content ?? [],
    [productData?.content]
  );

  const handleLoadMore = () => {
    // Don't fetch more if we're already fetching or if it's the last page
    if (!isFetching && !productData?.last) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>
        {item.name} - ${item.price}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!isFetching) return null;
    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  };

  if (isLoading && page === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error: {error.data?.message || "Failed to fetch products"}</Text>
      </View>
    );
  }

  if (!products.length) {
    return (
      <View style={styles.center}>
        <Text>No products found for this store.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      // Optional: Add a pull-to-refresh feature
      // refreshing={isFetching && page === 0}
      // onRefresh={() => {
      //   // This would typically involve refetching from page 0
      //   // RTK Query handles this via its refetch function if needed,
      //   // but this example focuses on infinite scroll.
      // }}
    />
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
});

export default ProductListExample;
