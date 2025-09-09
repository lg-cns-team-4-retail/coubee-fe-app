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
import { useAuthContext } from "app/contexts/AuthContext";
import { useDispatch } from "react-redux";
import { clearSearchState } from "../../redux/slices/searchSlice";
const TAB_ICON_SIZE = 24;

export default function TabLayout() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isAuthenticated, nickname } = useAuthContext();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary!.val,
        tabBarStyle: {
          backgroundColor: theme.background!.val,
          borderTopColor: theme.background!.val,
        },
        headerStyle: {
          backgroundColor: theme.background!.val,
          borderBottomColor: theme.background!.val,
        },
        headerTintColor: theme.color!.val,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color }) => <Home color={color as any} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="Search"
        options={{
          title: "검색",
          tabBarIcon: ({ color }) => <Search color={color as any} />,
          tabBarStyle: {
            display: "none",
          },
          presentation: "modal", //슬라이드 이펙트
          animation: "fade",
          headerShown: false,
        }}
        /* listeners={{
          blur: () => {
            //포커스 지웠을때 검색어 키워드 초기화
            dispatch(clearSearchState());
          },
        }} */
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
