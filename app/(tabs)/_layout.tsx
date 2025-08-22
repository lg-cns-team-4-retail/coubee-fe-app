import { Link, Tabs } from "expo-router";
import { Button, useTheme } from "tamagui";
import {
  Atom,
  AudioWaveform,
  Home,
  Search,
  ShoppingBasket,
} from "@tamagui/lucide-icons";
import CoubeeSvgClick from "../../components/icons/CoubeeSvgClick";
import CoubeeSvgUnclick from "../../components/icons/CoubeeSvgUnclick";
import CoubeeSvgUnclickLeft from "../../components/icons/CoubeeSvgUnclickLeft";

const TAB_ICON_SIZE = 24;

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary!.val,
        tabBarStyle: {
          backgroundColor: theme.background!.val,
          borderTopColor: theme.borderColor!.val,
        },
        headerStyle: {
          backgroundColor: theme.background!.val,
          borderBottomColor: theme.borderColor!.val,
        },
        headerTintColor: theme.primary!.val,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color }) => <Home color={color as any} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Button mr="$4" size="$2.5">
                Hello!
              </Button>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          title: "검색",
          tabBarIcon: ({ color }) => <Search color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="History"
        options={{
          title: "내역",
          tabBarIcon: ({ color }) => <ShoppingBasket color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="MyPage"
        options={{
          title: "마이 쿠비",
          tabBarIcon: ({ color, focused }) =>
            focused ? (
              <CoubeeSvgClick
                color={color}
                width={TAB_ICON_SIZE}
                height={TAB_ICON_SIZE}
              />
            ) : (
              <CoubeeSvgUnclick
                color={color}
                width={TAB_ICON_SIZE}
                height={TAB_ICON_SIZE}
              />
            ),
        }}
      />
    </Tabs>
  );
}
