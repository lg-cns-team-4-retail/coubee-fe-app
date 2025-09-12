# Coubee Frontend Application

## 📜 프로젝트 소개

Coubee는 사용자가 주변 상점에서 상품을 주문하고 배달받을 수 있는 모바일 커머스 애플리케이션입니다. 이 프로젝트는 React Native를 기반으로 하여 iOS와 Android 플랫폼 모두에서 원활하게 동작하는 것을 목표로 합니다.

## ✨ 주요 기술 스택

| 카테고리 | 기술 | 설명 |
| --- | --- | --- |
| **Core Framework** | `React Native`, `Expo` | iOS 및 Android 네이티브 앱 개발을 위한 프레임워크 |
| **UI/UX** | `Tamagui` | React Native와 웹에서 동시에 사용 가능한 통합 스타일링 및 UI 라이브러리 |
| **State Management** | `Redux Toolkit` | 전역 상태 관리를 위한 라이브러리 |
| **Navigation** | `Expo Router` | 파일 시스템 기반의 라우팅을 제공하여 직관적인 화면 이동 관리 |
| **API Communication** | `Axios` | HTTP 요청을 위한 Promise 기반의 클라이언트 라이브러리 |
| **Asynchronous Storage** | `@react-native-async-storage/async-storage` | 앱 내 데이터의 영구 저장을 위한 비동기 스토리지 |
| **Secure Storage** | `expo-secure-store` | 민감한 정보(예: 토큰)를 안전하게 저장하기 위한 라이브러리 |
| **Map Integration** | `react-native-webview` | 카카오맵 API 등 웹 기반 지도를 연동하기 위한 웹뷰 |
| **Payment** | `@portone/react-native-sdk` | 포트원 결제 서비스를 연동하기 위한 SDK |

## 📂 프로젝트 구조

```
/
├── app/                  # Expo Router를 사용한 라우팅 및 화면 구성
│   ├── (auth)/           # 인증 관련 화면 (로그인, 회원가입)
│   ├── (tabs)/           # 메인 탭 화면 (홈, 검색, 주문 내역, 마이페이지)
│   ├── checkout/         # 주문 결제 화면
│   ├── contexts/         # 전역 상태 관리 (인증)
│   ├── hooks/            # 커스텀 훅
│   ├── services/         # API 서비스 및 외부 모듈 연동
│   └── store/            # 상점 및 상품 관련 화면
├── assets/               # 폰트, 이미지, SVG 등 정적 에셋
├── components/           # 공통 UI 컴포넌트
├── redux/                # Redux 상태 관리 (Store, Slice, API)
├── theme/                # Tamagui 테마 및 토큰 설정
├── tamagui.config.ts     # Tamagui 설정 파일
└── package.json          # 프로젝트 의존성 및 스크립트
```

## 🚀 시작하기

1.  **의존성 설치**

    ```bash
    yarn install
    ```

2.  **애플리케이션 실행**

    -   **iOS**
        ```bash
        yarn ios
        ```
    -   **Android**
        ```bash
        yarn android
        ```
    -   **Web**
        ```bash
        yarn web
        ```