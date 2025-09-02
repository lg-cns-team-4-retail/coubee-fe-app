import { useState, useEffect } from "react";
import { YStack, XStack, Input, Button, Text } from "tamagui";
import MapComponentContainer from "./storeSearch/MapComponentContainer";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Search } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import SearchResultsSheet from "./storeSearch/SearchResultsSheet";
import { useTheme } from "tamagui";
import StoreSearchTab from "./storeSearch/StoreSearchTab";
import { useLocation } from "../app/hooks/useLocation";
import ProductSearchTab from "./productSearch/ProductSearchTab";

export const SearchComponent = () => {
  const router = useRouter();
  const theme = useTheme();

  const [activeTab, setActiveTab] = useState("store");

  const { location } = useLocation();

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (location) {
      /* setUserLocation({
        lat: location.latitude,
        lng: location.longitude,
      }); */
      setUserLocation({
        lat: 37.559661293097975,
        lng: 127.0053580437816,
      });
    }
  }, [location]);

  const [inputValue, setInputValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = () => {
    const newKeyword = inputValue.trim();

    // 2. 이 변수를 사용해 상태를 업데이트합니다.
    setSearchKeyword(newKeyword);

    // 3. 그리고 라우터 이동에도 동일한 변수를 사용합니다.
    console.log(newKeyword); // 이제 올바른 값이 출력됩니다.
    /* router.push(`/store/${1177}?keyword=${newKeyword}`); */
  };

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
              <StoreSearchTab
                searchKeyword={searchKeyword}
                userLocation={userLocation}
              />
            </>
          )}

          {activeTab === "product" && (
            <>
              <ProductSearchTab
                searchKeyword={searchKeyword}
                userLocation={userLocation}
              />
            </>
          )}
        </YStack>
      </YStack>
    </SafeAreaView>
  );
};

export default SearchComponent;
