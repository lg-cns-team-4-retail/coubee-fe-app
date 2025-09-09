import { Text, View } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchComponent from "../../components/SearchComponent";
import { useLocalSearchParams } from "expo-router";
export default function TabTwoScreen() {
  const { keyword } = useLocalSearchParams();

  return (
    <View flex={1} items="center" justify="center" bg="$background">
      <SearchComponent searchKeywordFromParam={keyword} />
    </View>
  );
}
