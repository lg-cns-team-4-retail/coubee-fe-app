import { useState, useEffect, useCallback } from "react";
import { YStack, XStack, Input, Button, Text } from "tamagui";
import MapComponentContainer from "./storeSearch/MapComponentContainer";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Search } from "@tamagui/lucide-icons";
import { useFocusEffect, useRouter } from "expo-router";
import SearchResultsSheet from "./storeSearch/SearchResultsSheet";
import { useTheme } from "tamagui";
import StoreSearchTab from "./storeSearch/StoreSearchTab";
import { useLocation } from "../app/hooks/useLocation";
import ProductSearchTab from "./productSearch/ProductSearchTab";
import { useSelector, useDispatch } from "react-redux";
import {
  setSearchState,
  setActiveTab,
  clearSearchState,
} from "../redux/slices/searchSlice";

export const SearchComponent = () => {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();

  const { location } = useLocation();

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (location) {
      setUserLocation({
        lat: location.latitude,
        lng: location.longitude,
      });
      /* setUserLocation({
        lat: 37.559661293097975,
        lng: 127.0053580437816,
      }); */
    }
  }, [location]);
  const {
    keyword: searchKeyword,
    inputValue,
    activeTab,
  } = useSelector((state) => state.search);

  const handleInputChange = (text) => {
    dispatch(setSearchState({ inputValue: text, keyword: searchKeyword }));
  };

  const handleSearch = () => {
    dispatch(setSearchState({ inputValue, keyword: inputValue }));
  };

  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };

  /*   const [inputValue, setInputValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = () => {
    const newKeyword = inputValue.trim();

    setSearchKeyword(newKeyword);
  };
 */

  const handleBackClick = () => {
    dispatch(clearSearchState());
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val }}>
      <YStack flex={1} backgroundColor="$background">
        <YStack padding="$4" gap="$3" alignItems="center">
          <XStack gap="$2" alignItems="center">
            <Button
              icon={<ChevronLeft size="$2" />}
              onPress={handleBackClick}
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
              onChangeText={handleInputChange}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <Button icon={<Search />} onPress={handleSearch} circular />
          </XStack>

          {/* 상점/상품 검색 버튼 그룹 */}
          <XStack gap="$2">
            <Button
              onPress={() => handleTabChange("store")}
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
              onPress={() => handleTabChange("product")}
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
                key={`store-${searchKeyword}`}
                searchKeyword={searchKeyword}
                userLocation={userLocation}
              />
            </>
          )}

          {activeTab === "product" && (
            <>
              <ProductSearchTab
                key={`product-${searchKeyword}`}
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
