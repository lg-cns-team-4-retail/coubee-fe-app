import React from "react";
import SearchResultsMap from "./SearchResultsMap";
import SearchResultsSheet from "./SearchResultsSheet";
import { YStack } from "tamagui";

export default MapComponentContainer = () => {
  const currentUserLocation = {
    latitude: 37.5595,
    longitude: 127.0053,
  };

  // API로부터 받은 검색 결과 데이터 (예시)
  const searchResults = [
    {
      storeId: 1037,
      storeName: "장충동악세서리",
      description:
        "반지·목걸이·귀걸이 등 데일리 주얼리를 선보입니다. 정성스러운 응대와 간단 수선로 특별한 하루를 완성해 보세요.",
      contactNo: "02-9702-6279",
      storeAddress: "서울특별시 중구 동호로24길 13",
      workingHour: "평일 오전11:30~오후11:30 주말 오후12:30~오후7:30",
      backImg:
        "https://d1du1htkbm5yt2.cloudfront.net/store/background/3e4d04e5-c2f3-4a7b-b322-7c28a36f2dec.jpeg",
      profileImg:
        "https://d1du1htkbm5yt2.cloudfront.net/store/profile/741802bc-0040-4fff-a107-128616e705e0.jpeg",
      longitude: 127.00506836520799,
      latitude: 37.55971019655798,
      storeTag: [
        {
          categoryId: 60,
          name: "패션1",
        },
        {
          categoryId: 62,
          name: "스타일",
        },
        {
          categoryId: 61,
          name: "장신구",
        },
        {
          categoryId: 59,
          name: "악세서리",
        },
      ],
      distance: 26.106701945401174,
    },
    {
      storeId: 1053,
      storeName: "동국문방구",
      description:
        "지역 고객의 일상을 채우는 라이프스타일 스토어입니다. 지역 밀착형 서비스와 맞춤 주문를 제공해 오늘도 기분 좋은 쇼핑을 만나보세요.",
      contactNo: "010-7732-7594",
      storeAddress: "서울 중구 장충동2가 189-5",
      workingHour: "평일 오전10:30~오후11:30 주말 오전10:30~오후6:30",
      backImg:
        "https://d1du1htkbm5yt2.cloudfront.net/store/background/014a4d05-74d4-4c75-9671-c2d8702008b5.jpeg",
      profileImg:
        "https://d1du1htkbm5yt2.cloudfront.net/store/profile/0749dac1-a815-420f-bce8-7dd5e24828ed.jpeg",
      longitude: 127.00508445846208,
      latitude: 37.55946142644947,
      storeTag: [
        {
          categoryId: 65,
          name: "필기",
        },
        {
          categoryId: 63,
          name: "문구",
        },
        {
          categoryId: 64,
          name: "학용품",
        },
        {
          categoryId: 66,
          name: "사무",
        },
      ],
      distance: 32.79442215346818,
    },
  ];
  return (
    <>
      <SearchResultsMap center={currentUserLocation} markers={searchResults} />
    </>
  );
};
