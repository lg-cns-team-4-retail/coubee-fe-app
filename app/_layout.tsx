import "../tamagui-web.css";

import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import TProvider from "../components/Provider";
import { useTheme } from "tamagui";
import { AuthProvider } from "./contexts/AuthContext";
import {
  requestNotificationPermissions,
  addNotificationListener,
  addNotificationResponseListener,
} from "./services/notifications";
import { handleNotificationNavigation } from "./services/notificationNavigation";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import GlobalModal from "../components/GlobalModal";
import QRCodeModal from "../components/OrderHistory/QRCodeModal";
import { AppState } from "react-native";
import { useDispatch } from "react-redux";
import { apiSlice } from "../redux/api/apiSlice";
export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    const setupNotifications = async () => {
      await requestNotificationPermissions();
    };

    setupNotifications();

    const notificationListener = addNotificationListener((notification) => {
      console.log("Notification received:", notification);
    });

    const responseListener = addNotificationResponseListener((response) => {
      handleNotificationNavigation(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  useEffect(() => {
    if (interLoaded || interError) {
      SplashScreen.hideAsync();
    }
  }, [interLoaded, interError]);

  if (!interLoaded && !interError) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Providers>
          <RootLayoutNav />
        </Providers>
      </PersistGate>
    </Provider>
  );
}

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <TProvider>{children}</TProvider>;
};

function RootLayoutNav() {
  const dispatch = useDispatch();
  useEffect(() => {
    // 앱 상태 변경을 감시하는 리스너를 등록합니다.
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // 앱이 비활성/백그라운드 상태에 있다가 '활성' 상태로 돌아왔을 때
      if (nextAppState === "active") {
        console.log("App has come to the foreground!"); // 동작 확인용 로그

        // 우리가 갱신하길 원하는 모든 데이터의 태그를 강제로 무효화시킵니다.
        // 이 명령은 "이 태그가 붙은 데이터는 모두 낡았으니, 다음에 필요할 때 새로 가져오라!"는 의미입니다.
        dispatch(
          apiSlice.util.invalidateTags([
            "Store",
            "Products",
            "Product",
            "Orders",
            "Search",
            "InterestStore", // 이전 대화에서 추가했던 태그
          ])
        );
      }
    });

    // 컴포넌트가 사라질 때 리스너를 정리합니다.
    return () => {
      subscription.remove();
    };
  }, [dispatch]);

  const colorScheme = useColorScheme();
  const theme = useTheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          <Stack screenOptions={{ animation: "default" }}>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
                headerStyle: {
                  backgroundColor: theme.primary?.val,
                },
                headerTintColor: "#fff",
              }}
            />

            <Stack.Screen
              name="(auth)/login"
              options={{
                title: "로그인",
                headerStyle: {
                  backgroundColor: theme.primary?.val,
                },
                headerTintColor: "#fff",
                headerBackTitle: "뒤로",
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="store/[storeId]"
              options={{
                headerShown: false,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="storeInformation/[storeId]"
              options={{
                headerShown: false,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="productView/[productId]"
              options={{
                headerShown: false,
                headerShadowVisible: false,
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen
              name="orderDetail/[orderId]"
              options={{
                title: "주문 상세보기",
                headerStyle: {
                  backgroundColor: theme.primary?.val,
                },
                headerTintColor: "#fff",
                headerBackTitle: "뒤로",
                headerShown: true,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="checkout/index"
              options={{
                title: "주문하기",
                headerStyle: {
                  backgroundColor: theme.primary?.val,
                },
                headerTintColor: "#fff",
                headerBackTitle: "뒤로",
                headerShown: true,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="payment/index"
              options={{
                title: "결제하기",
                headerShown: false,
                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="(auth)/register"
              options={{
                title: "회원가입",
                headerStyle: {
                  backgroundColor: theme.primary?.val,
                },
                headerTintColor: "#fff",
                headerBackTitle: "뒤로",
                headerShadowVisible: false,
              }}
            />

            <Stack.Screen
              name="myList/index"
              options={{
                title: "찜한 매장 & 추천",
                headerShown: false,

                headerShadowVisible: false,
              }}
            />
            <Stack.Screen
              name="modal"
              options={{
                title: "Tamagui + Expo",
                presentation: "modal",
                animation: "slide_from_right",
                gestureEnabled: true,
                gestureDirection: "horizontal",
                contentStyle: {
                  backgroundColor: theme.background?.val,
                },
              }}
            />
          </Stack>

          <GlobalModal />
          <QRCodeModal />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
