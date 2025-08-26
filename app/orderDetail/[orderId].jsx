import React from "react";
import { ScrollView } from "tamagui";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderDetailCard from "../../components/OrderDetailCard";

// API를 통해 받아올 주문 내역 데이터 (예시)
const sampleOrder = {
  orderId: "ORDER-12345",
  status: "PREPARING", // PAID, PREPARING, PREPARED, RECEIVED, CANCELLED
  store: {
    storeId: 1041,
    storeName: "장충동악세서리",
    backImg:
      "https://d1du1htkbm5yt2.cloudfront.net/store/background/3e4d04e5-c2f3-4a7b-b322-7c28a36f2dec.jpeg",
    profileImg:
      "https://d1du1htkbm5yt2.cloudfront.net/store/profile/741802bc-0040-4fff-a107-128616e705e0.jpeg",
  },
  products: [
    {
      productId: 1,
      productName: "신선한 제철 딸기 500g",
      productImg: "https://via.placeholder.com/150/FF6347/FFFFFF?text=딸기",
      salePrice: 12000,
      quantity: 2,
    },
    {
      productId: 2,
      productName: "유기농 블루베리 200g",
      productImg: "https://via.placeholder.com/150/4169E1/FFFFFF?text=블루베리",
      salePrice: 9900,
      quantity: 1,
    },
  ],
};

const sampleCancelledOrder = {
  ...sampleOrder,
  orderId: "ORDER-67890",
  status: "CANCELLED",
};

const OrderHistoryScreen = () => {
  // 실제로는 API를 통해 여러 주문 목록을 받아와 map 함수를 사용하게 될 것입니다.
  // const { data: orders } = useGetOrdersQuery();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <OrderDetailCard order={sampleOrder} />
        <OrderDetailCard order={sampleCancelledOrder} />
        {/* orders.map(order => <OrderDetailCard key={order.orderId} order={order} />) */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderHistoryScreen;
