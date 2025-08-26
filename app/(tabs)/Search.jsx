import { Text, View } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchComponent from "../../components/SearchComponent";
export default function TabTwoScreen() {
  return (
    <View flex={1} items="center" justify="center" bg="$background">
      <SearchComponent />
    </View>
  );
}
