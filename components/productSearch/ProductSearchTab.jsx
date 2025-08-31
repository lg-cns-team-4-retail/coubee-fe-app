// components/productSearch/ProductSearchTab.jsx
import { useCallback, useState } from "react";
import { YStack, Text, Spinner } from "tamagui";
import { FlatList } from "react-native";
import ProductItem from "../ProductItem";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { useSearchProductsQuery } from "../../redux/api/apiSlice";
import ListEmptyComponent from "../ListEmptyComponent";

const ProductSearchTab = ({ searchKeyword, userLocation }) => {
  const router = useRouter();

  const [page, setPage] = useState(0);

  const { data, isLoading, isFetching } = useSearchProductsQuery(
    { keyword: searchKeyword, page, ...userLocation },
    {
      skip: !userLocation,
    }
  );

  const renderItem = useCallback(
    ({ item }) => (
      <ProductItem
        item={item}
        onPress={() => {
          router.push(`/store/${item.storeId}`);
        }}
      />
    ),
    []
  );

  const loadMore = () => {
    if (!data?.last && !isFetching) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  if (isLoading && page === 0) {
    return <Spinner size="large" color="$primary" />;
  }

  if (!data || data.content.length === 0) {
    return <ListEmptyComponent message="검색된 상품이 없습니다." />;
  }

  return (
    <FlatList
      data={data.content}
      renderItem={renderItem}
      keyExtractor={(item) => item.productId.toString()}
      onEndReached={loadMore}
      onEndReachedThreshold={0.1}
      ListFooterComponent={isFetching ? <Spinner /> : null}
    />
  );
};

export default ProductSearchTab;
