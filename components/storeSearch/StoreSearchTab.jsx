// components/storeSearch/StoreSearchTab.jsx

import React, { useEffect, useState } from "react";
import { YStack, Spinner } from "tamagui";
import MapComponentContainer from "./MapComponentContainer";
import SearchResultsSheet from "./SearchResultsSheet";
import ListEmptyComponent from "../ListEmptyComponent";
import { useSearchStoresQuery } from "../../redux/api/apiSlice";

/**
 * 상점 검색 탭의 UI와 데이터 로직을 담당하는 컴포넌트
 * @param {string} searchKeyword - 상위 컴포넌트에서 전달받는 검색 키워드
 */
const StoreSearchTab = ({ searchKeyword }) => {
  // 페이지네이션을 위한 state
  const [page, setPage] = useState(0);

  // RTK Query 훅을 사용하여 API 호출
  const {
    data: searchData,
    isLoading,
    isFetching,
    isError,
    // refetch 함수는 당겨서 새로고침 등에 활용할 수 있습니다.
    refetch,
  } = useSearchStoresQuery({
    // searchKeyword가 비어있으면 빈 문자열로 API 요청
    keyword: searchKeyword || "",
    lat: 37.5595,
    lng: 127.0053,
    page: page,
    size: 20,
  });

  // 검색 결과 데이터
  const searchResults = searchData?.content || [];

  // 최초 로딩 시 스피너를 표시합니다.
  if (isLoading) {
    return (
      <YStack flex={1} jc="center" ai="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  // 에러 발생 시
  if (isError) {
    return (
      <ListEmptyComponent message="상점 정보를 불러오는 데 실패했습니다." />
    );
  }

  // 검색 결과가 없을 때
  if (searchResults.length === 0) {
    const message = searchKeyword
      ? `'${searchKeyword}'에 대한 검색 결과가 없습니다.`
      : "주변에 등록된 상점이 없습니다.";
    return <ListEmptyComponent message={message} />;
  }

  // 정상적으로 데이터가 있을 때
  return (
    <>
      <MapComponentContainer searchResults={searchResults} />
      <SearchResultsSheet searchResults={searchResults} />
    </>
  );
};

export default StoreSearchTab;
