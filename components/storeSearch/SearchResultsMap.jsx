import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";

import { config } from "../../app/config/env";

const KAKAO_MAP_JS_KEY = config.kakaoJSKey;

/**
 * 검색 결과를 지도에 표시하는 컴포넌트입니다.
 * @param {object} center - 지도의 중심점 { latitude, longitude }
 * @param {array} markers - 지도에 표시할 마커 데이터 배열 [{ storeId, latitude, longitude, title }, ...]
 */
export default function SearchResultsMap({ center, markers = [] }) {
  const router = useRouter(); // 2. router 인스턴스를 생성합니다.

  // 마커 데이터를 WebView의 JavaScript에서 사용할 수 있도록 JSON 문자열로 변환합니다.
  const markersJson = JSON.stringify(markers);

  // WebView에 로드할 HTML 및 JavaScript 코드입니다.
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_JS_KEY}&libraries=services"></script>
        <style>
          html, body { height: 100%; margin: 0; padding: 0; }
          #map { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          // React Native에서 보낸 마커 데이터를 파싱합니다.
          const markersData = JSON.parse('${markersJson}');

          window.onload = function() {
            const mapContainer = document.getElementById('map');
            const mapOption = {
              // 요구사항 2: 현재 유저의 위치를 지도의 중심점으로 설정합니다.
              center: new kakao.maps.LatLng(${center.latitude}, ${center.longitude}),
              level: 4 // 여러 마커를 보여주기 위해 레벨을 조금 조정할 수 있습니다.
            };
            const map = new kakao.maps.Map(mapContainer, mapOption);

            // 요구사항 1: 검색 결과에 따른 여러 개의 마커를 생성합니다.
            markersData.forEach(markerInfo => {
              const markerPosition = new kakao.maps.LatLng(markerInfo.latitude, markerInfo.longitude);
              
              const marker = new kakao.maps.Marker({
                position: markerPosition,
                clickable: true // 마커를 클릭할 수 있도록 설정합니다.
              });

              marker.setMap(map);

              // 요구사항 3: 각 마커에 클릭 이벤트를 추가합니다.
              kakao.maps.event.addListener(marker, 'click', function() {
                // 마커 클릭 시 React Native로 메시지를 보냅니다.
                const message = JSON.stringify({
                  type: 'marker_press',
                  storeId: markerInfo.storeId
                });
                window.ReactNativeWebView.postMessage(message);
              });
            });
          };
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        // WebView 내에서 React Native로 메시지를 보낼 때 이 함수가 실행됩니다.
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            // 메시지 유형이 'marker_press'이고 storeId가 있으면 페이지를 이동시킵니다.
            if (data.type === "marker_press" && data.storeId) {
              router.push(`/store/${data.storeId}`);
            }
          } catch (error) {
            console.error("WebView 메시지 처리 오류:", error);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  webview: {
    flex: 1,
  },
});
