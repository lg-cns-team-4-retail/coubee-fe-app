import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { config } from "../app/config/env";
// 이 부분은 전하의 환경에 맞게 설정하셔야 합니다.
// import { config } from "../app/config/env";
// const KAKAO_MAP_JS_KEY = config.kakaoJSKey;
const KAKAO_MAP_JS_KEY = config.kakaoJSKey;

export default function KakaoMap({
  latitude,
  longitude,
  width = "100%",
  height = 450,
}) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_JS_KEY}&libraries=services"></script>
        <style>
          html, body { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; }
          #map { width: 100%; height: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          window.onload = function() {
            if (typeof kakao !== 'undefined' && kakao.maps) {
              const mapContainer = document.getElementById('map');
              const mapOption = {
                center: new kakao.maps.LatLng(${latitude}, ${longitude}),
                level: 3
              };
              const map = new kakao.maps.Map(mapContainer, mapOption);

              const markerPosition = new kakao.maps.LatLng(${latitude}, ${longitude});
              const marker = new kakao.maps.Marker({
                position: markerPosition
              });
              marker.setMap(map);
            } else {
              console.error('Kakao Maps is not available');
            }
          };
        </script>
      </body>
    </html>
  `;

  return (
    <View style={[styles.container, { width, height }]}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
  },
});
