import { useState } from "react";
import { YStack, XStack, Input, Button, Text } from "tamagui";
import MapComponentContainer from "./storeSearch/MapComponentContainer";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Search } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import SearchResultsSheet from "./storeSearch/SearchResultsSheet";
import { useTheme } from "tamagui";
import StoreSearchTab from "./storeSearch/StoreSearchTab";

export const SearchComponent = () => {
  const router = useRouter();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState("store");

  const [inputValue, setInputValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = () => {
    setSearchKeyword(inputValue.trim());
  };

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
    {
      storeId: 1044,
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
      storeId: 1038,
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
      storeId: 1039,
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
      storeId: 1040,
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
      storeId: 1041,
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
      storeId: 1042,
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
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val }}>
      <YStack flex={1} backgroundColor="$background">
        <YStack padding="$4" gap="$3" alignItems="center">
          <XStack gap="$2" alignItems="center">
            <Button
              icon={<ChevronLeft size="$2" />}
              onPress={() => router.back()}
              chromeless
              circular
            />

            <Input
              placeholder="검색어를 입력하세요"
              size="$4"
              borderRadius={999}
              f={1}
              borderColor="$borderColor"
              borderWidth={1}
              focusStyle={{ borderColor: "$primary" }}
              value={inputValue}
              onChangeText={setInputValue}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <Button icon={<Search />} onPress={handleSearch} circular />
          </XStack>

          {/* 상점/상품 검색 버튼 그룹 */}
          <XStack gap="$2">
            <Button
              onPress={() => setActiveTab("store")}
              backgroundColor={
                activeTab === "store" ? "$primary" : "transparent"
              }
              borderColor={activeTab !== "store" ? "$borderColor" : undefined}
              borderWidth={activeTab !== "store" ? 1 : 0}
              borderRadius="$8"
              paddingHorizontal="$4"
            >
              <Text
                color={activeTab === "store" ? "white" : "$color"}
                fontWeight="bold"
              >
                상점 검색
              </Text>
            </Button>
            <Button
              onPress={() => setActiveTab("product")}
              backgroundColor={
                activeTab === "product" ? "$primary" : "transparent"
              }
              borderColor={activeTab !== "product" ? "$borderColor" : undefined}
              borderWidth={activeTab !== "product" ? 1 : 0}
              borderRadius="$8"
              paddingHorizontal="$4"
            >
              <Text
                color={activeTab === "product" ? "white" : "$color"}
                fontWeight="bold"
              >
                상품 검색
              </Text>
            </Button>
          </XStack>
        </YStack>

        <YStack flex={1}>
          {activeTab === "store" && (
            <>
              <StoreSearchTab searchKeyword={searchKeyword} />
            </>
          )}

          {activeTab === "product" && <></>}
        </YStack>
      </YStack>
    </SafeAreaView>
  );
};

export default SearchComponent;
