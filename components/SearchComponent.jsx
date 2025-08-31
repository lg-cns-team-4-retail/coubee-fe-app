import { useState } from "react";
import { YStack, XStack, Input, Button, Text } from "tamagui";
import MapComponentContainer from "./storeSearch/MapComponentContainer";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Search } from "@tamagui/lucide-icons";
import { useRouter } from "expo-router";
import SearchResultsSheet from "./storeSearch/SearchResultsSheet";
import { useTheme } from "tamagui";

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
    setSearchKeyword(inputValue.trim());
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
              icon={<Search />}
            />
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
              <MapComponentContainer />
              <SearchResultsSheet searchResults={searchResults} />
            </>
          )}

          {activeTab === "product" && <></>}
        </YStack>
      </YStack>
    </SafeAreaView>
  );
};

export default SearchComponent;
