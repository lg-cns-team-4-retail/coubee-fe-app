import { useState, useEffect } from "react";
import { YStack, ScrollView, Button, XStack, Input } from "tamagui";
import { useAuthContext } from "../contexts/AuthContext";
import { useLocation } from "../hooks/useLocation";
import { persistor } from "../../redux/store";
import { useDispatch } from "react-redux";
import { Search } from "@tamagui/lucide-icons";
import { router } from "expo-router";

import { apiSlice } from "../../redux/api/apiSlice";
import {
  useGetPopularProductQuery,
  useGetPopularInterestStoreQuery,
  useGetRecommendedProductQuery,
} from "../../redux/api/apiSlice";
import PopularProductSection from "../../components/LandingPage/PopularProductSection";
import PopularStoreSection from "../../components/LandingPage/PopularStoreSection";

import AppHeader from "../../components/AppHeader";
import { useToastController } from "@tamagui/toast";
import RecommendedProductSection from "../../components/RecommendProductSection";

export default function LandingPage() {
  const { logout, userId, isAuthenticated, nickname } = useAuthContext();
  const dispatch = useDispatch();
  const toast = useToastController();
  const { location } = useLocation();

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (location) {
      setUserLocation({
        lat: location.latitude,
        lng: location.longitude,
      });
      //집에서 테스트용 박아두기
      /* setUserLocation({
        lat: 37.559661293097975,
        lng: 127.0053580437816,
      }); */
    }
  }, [location]);
  const [page, setPage] = useState(0);

  //인기 제품 보여주기
  const { data: popularProduct, isLoading: popularProductLoading } =
    useGetPopularProductQuery(
      {
        page,
        size: 10,
        ...userLocation,
      },
      {
        skip: !userLocation,
      }
    );
  //인기 매장
  const { data: popularInterestStore, isLoading: popularInterestStoreLoading } =
    useGetPopularInterestStoreQuery(
      {
        ...userLocation,
      },
      {
        skip: !userLocation,
      }
    );
  const popularProductList = popularProduct?.content || [];
  //로그인용 유저 추천 (personalize)
  const {
    data: recommendProducts,
    isLoading: isRecommendProductLoading,
    refetch: refetchProducts,
  } = useGetRecommendedProductQuery(undefined, {
    skip: !isAuthenticated,
  });
  const handleLogout = async () => {
    try {
      await logout();
      dispatch(apiSlice.util.resetApiState());
      toast.show("로그아웃 성공");
    } catch (error) {
      toast.show("로그아웃에 실패했습니다");
    }
  };

  const handlePurge = async () => {
    await persistor.purge();
  };
  return (
    <YStack flex={1} bg="$background">
      <AppHeader />
      <ScrollView>
        <YStack flex={1} gap="$3" px="$3" pt="$5">
          {isAuthenticated ? (
            <RecommendedProductSection
              products={recommendProducts}
              isLoading={isRecommendProductLoading}
            />
          ) : (
            <PopularProductSection
              products={popularProductList}
              isLoading={popularProductLoading}
            />
          )}
          <PopularStoreSection
            stores={popularInterestStore}
            isLoading={popularInterestStoreLoading}
          />
        </YStack>
      </ScrollView>
    </YStack>
  );
}

{
  /* <Card padding="$4" width="90%" backgroundColor="$background">
        <YStack gap="$2">
          <Text fontSize="$5" fontWeight="bold">
            위치 정보
          </Text>
          {loading && <Text>위치 정보를 가져오는 중...</Text>}
          {error && <Text color="$red10">{error}</Text>}
          {location && (
            <YStack gap="$1">
              <Text>위도: {location.latitude.toFixed(6)}</Text>
              <Text>경도: {location.longitude.toFixed(6)}</Text>
              {location.accuracy && (
                <Text>정확도: {Math.round(location.accuracy)}m</Text>
              )}
              <Text>시간: {new Date(location.timestamp).toLocaleString()}</Text>
            </YStack>
          )}
          <Button size="$3" onPress={() => getCurrentLocation()}>
            위치 새로고침
          </Button>
        </YStack>
      </Card> */
}

{
  /*  {isAuthenticated ? (
        <YStack flexWrap="wrap" gap="$4">
          <Text>환영합니다!</Text>
          <Text>사용자명: {userId}</Text>

          <Button onPress={handleCopyPushToken} theme="blue" size="$4">
            푸시 토큰 복사 (Expo Tool용)
          </Button>

          <Button onPress={handleLogout} theme="red" size="$4">
            로그아웃
          </Button>
          <XStack flexWrap="wrap" gap="$1.5">
            <Button
              onPress={() => router.push("/store/1177")}
              theme="blue"
              size="$4"
            >
              가게보기
            </Button>
            <Button
              onPress={() => router.push(`/store/${storeId3}`)}
              theme="blue"
              size="$4"
            >
              {"가게보기" + storeId3}
            </Button>

            <Button
              onPress={() => router.push(`/orderDetail/${testOrderId}`)}
              theme="blue"
              size="$4"
            >
              주문내역
            </Button>
          </XStack>
          <XStack>
            <Input onChangeText={setTestingStoreId} value={testingStoreId} />
            <Button
              onPress={() => router.push(`/store/${testingStoreId}`)}
              theme="blue"
              size="$4"
            >
              가게 갑시다 {testingStoreId}
            </Button>
          </XStack>
        </YStack>
      ) : (
        <XStack flexWrap="wrap" gap="$1.5">
          <Button onPress={() => router.push("/login")} theme="blue" size="$4">
            로그인
          </Button>
          <Button
            onPress={() => router.push(`/store/${storeId}`)}
            theme="blue"
            size="$4"
          >
            가게보기
          </Button>
          <Button
            onPress={() => router.push(`/checkout`)}
            theme="blue"
            size="$4"
          >
            바슷ㅅ켓
          </Button>
          <Button
            onPress={() => router.push(`/store/${storeId2}`)}
            theme="blue"
            size="$4"
          >
            가게보기2
          </Button>
          <Button onPress={handlePurge}>초기화</Button>
          <Button
            onPress={() => router.push("/checkout")}
            theme="blue"
            size="$4"
          >
            장바구니
          </Button>
          <Button
            onPress={() => router.push(`/orderDetail/${1144}`)}
            theme="blue"
            size="$4"
          >
            주문내역
          </Button>
        </XStack>
      )} */
}
