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

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [interLoaded, interError] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  useEffect(() => {
    // 알림 권한만 미리 요청 (토큰 등록은 로그인 후)
    const setupNotifications = async () => {
      await requestNotificationPermissions();
    };

    setupNotifications();

    // 알림 수신 리스너
    const notificationListener = addNotificationListener((notification) => {
      console.log("Notification received:", notification);
    });

    // 알림 응답 리스너 (사용자가 알림을 탭했을 때)
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
      // Hide the splash screen after the fonts have loaded (or an error was returned) and the UI is ready.
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
