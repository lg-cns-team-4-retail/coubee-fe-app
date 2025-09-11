import { useState, useEffect, useCallback } from "react";
import { YStack, XStack, Input, Button, Text } from "tamagui";
import MapComponentContainer from "./storeSearch/MapComponentContainer";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Search } from "@tamagui/lucide-icons";
import {
  useFocusEffect,
  useRouter,
  useLocalSearchParams,
  usePathname,
} from "expo-router";
import SearchResultsSheet from "./storeSearch/SearchResultsSheet";
import { useTheme } from "tamagui";
import StoreSearchTab from "./storeSearch/StoreSearchTab";
import { useLocation } from "../app/hooks/useLocation";
import ProductSearchTab from "./productSearch/ProductSearchTab";
import { useSelector, useDispatch } from "react-redux";
import { clearSearchState, setActiveTab } from "../redux/slices/searchSlice";

export const SearchComponent = ({ searchKeywordFromParam }) => {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useDispatch();

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
  const { activeTab } = useSelector((state) => state.search);
  const { keyword: searchKeyword } = useLocalSearchParams();
  const params = useLocalSearchParams();
  const pathname = usePathname();
  const [inputValue, setInputValue] = useState(searchKeyword || "");

  const handleSearch = () => {
    const newKeyword = inputValue.trim();
    if (newKeyword) {
      router.push(`/Search?keyword=${newKeyword}`);
    }
  };

  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };

  useEffect(() => {
    setInputValue(searchKeyword || "");
    if (!searchKeyword) {
      console.log(searchKeyword);
      dispatch(clearSearchState());
    }
  }, [searchKeyword]);

  const handleBackClick = () => {
    router.back();
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
              onChangeText={setInputValue}
              onSubmitEditing={handleSearch}
              value={inputValue}
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
                searchKeyword={searchKeyword || ""}
                userLocation={userLocation}
              />
            </>
          )}

          {activeTab === "product" && (
            <>
              <ProductSearchTab
                key={`product-${searchKeyword}`}
                searchKeyword={searchKeyword || ""}
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
