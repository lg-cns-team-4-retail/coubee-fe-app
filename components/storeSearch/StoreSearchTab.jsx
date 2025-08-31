// components/storeSearch/StoreSearchTab.jsx

import React, { useEffect, useState } from "react";
import { YStack, Spinner, View } from "tamagui";
import MapComponentContainer from "./MapComponentContainer";
import SearchResultsSheet from "./SearchResultsSheet";
import ListEmptyComponent from "../ListEmptyComponent";
import { useSearchStoresQuery } from "../../redux/api/apiSlice";
import StoreSkeleton from "./StoreSkeleton";

/**
 * 상점 검색 탭의 UI와 데이터 로직을 담당하는 컴포넌트
 * @param {string} searchKeyword - 상위 컴포넌트에서 전달받는 검색 키워드
 */

const StoreSearchTab = ({ searchKeyword, userLocation }) => {
  const [page, setPage] = useState(0);

  const { data, isLoading, isFetching, isError } = useSearchStoresQuery(
    { keyword: searchKeyword, page, ...userLocation, size: 5 },
    {
      skip: !userLocation,
    }
  );

  const loadMore = () => {
    if (!data?.last && !isFetching) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const searchResults = data?.content || [];

  /* if (isLoading && page === 0) {
    return (
      <YStack flex={1} jc="center" ai="center">
        <StoreSkeleton />
        <StoreSkeleton />
      </YStack>
    );
  }
 */
  // 에러 발생 시
  if (isError) {
    return (
      <ListEmptyComponent message="상점 정보를 불러오는 데 실패했습니다." />
    );
  }

  // 검색 결과가 없을 때
  if (data?.content.length === 0) {
    let message = "";
    if (searchKeyword.trim().length === 0) {
      message = `주변에 쿠비 매장이 존재하지 않아요`;
    } else {
      message = `주변에 "${searchKeyword}"로 시작되는 상점이 존재하지 않아요`;
    }

    return (
      <>
        <ListEmptyComponent message={message} />
      </>
    );
  }

  return (
    <View flex={1}>
      <MapComponentContainer searchResults={searchResults} />
      <SearchResultsSheet
        searchResults={searchResults}
        onLoadMore={loadMore}
        isFetching={isFetching}
        isLoading={isLoading && page === 0} //
        totalResults={data?.totalElements} // 👈 이 prop을 추가합니다.
      />
    </View>
  );
};

export default StoreSearchTab;
