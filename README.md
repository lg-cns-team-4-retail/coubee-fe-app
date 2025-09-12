# Coubee Frontend Application

## 📜 프로젝트 소개

Coubee는 사용자가 주변 상점에서 상품을 주문하고 픽업받을 수 있는 O2O 모바일 커머스 애플리케이션입니다. 이 프로젝트는 React Native와 Expo를 기반으로 하여 iOS와 Android 플랫폼 모두에서 원활하게 동작하는 것을 목표로 합니다.

## ✨ 주요 기술 스택

| 카테고리                 | 기술                                        | 설명                                                                              |
| ------------------------ | ------------------------------------------- | --------------------------------------------------------------------------------- |
| **Core Framework**       | `React Native`, `Expo`                      | iOS 및 Android 네이티브 앱 개발을 위한 프레임워크                                 |
| **UI/UX**                | `Tamagui`                                   | React Native와 웹에서 동시에 사용 가능한 통합 스타일링 및 UI 라이브러리           |
| **State Management**     | `Redux Toolkit`                             | 전역 상태 관리를 위한 라이브러리                                                  |
| **Navigation**           | `Expo Router`                               | 파일 시스템 기반의 라우팅을 제공하여 직관적인 화면 이동 관리                      |
| **API Communication**    | `Axios`, `RTK Query`                        | HTTP 요청 및 API 캐싱을 통해 불필요한 API 호출을 방지하고 매끄러운 UI 경험을 제공 |
| **Asynchronous Storage** | `@react-native-async-storage/async-storage` | 앱 내 데이터의 영구 저장을 위한 비동기 스토리지                                   |
| **Secure Storage**       | `expo-secure-store`                         | 민감한 정보(예: 토큰)를 안전하게 저장하기 위한 라이브러리                         |
| **Map Integration**      | `react-native-webview`                      | 카카오맵 API 등 웹 기반 지도를 연동하기 위한 웹뷰                                 |
| **Payment**              | `@portone/react-native-sdk`                 | 포트원 결제 서비스를 연동하기 위한 SDK                                            |

## 🌟 주요 기능

- **상점 및 상품 검색**: 사용자의 위치를 기반으로 주변 상점을 검색하고, 다양한 상품을 탐색할 수 있습니다.
- **주문 및 결제**: 장바구니 기능을 통해 원하는 상품을 담고, 포트원(PortOne) 결제 연동을 통해 간편하게 결제할 수 있습니다.
- **주문 내역 관리**: 실시간으로 주문 상태를 추적하고, 과거 주문 내역을 확인할 수 있습니다.
- **사용자 맞춤형 기능**: 관심 상점 등록, 사용자 정보 관리 등 개인화된 경험을 제공합니다.

## 📂 프로젝트 구조

```
/
├── app/                  # Expo Router를 사용한 라우팅 및 화면 구성
│   ├── (auth)/           # 인증 관련 화면 (로그인, 회원가입)
│   ├── (tabs)/           # 메인 탭 화면 (홈, 검색, 주문 내역, 마이페이지)
│   ├── checkout/         # 주문 결제 화면
│   ├── payment/          # 결제 화면 (portone sdk)
│   ├── storeInformation/ # 상점 정보 보기 화면
│   ├── productView/      # 상품 상세 보기 화면
│   ├── orderDetail/      # 주문 내역 상세 보기 화면
│   ├── myList/           # 추천 상품, 선호 매장 관리 화면
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
    npm install -g yarn
    npx expo install
    ```

2.  프로젝트 실행

```bash
npm run start
```

3.  **애플리케이션 실행**

    - **iOS**
      ```bash
      i
      ```
    - **Android**
      ```bash
      a
      ```
    - **Web**
      ```bash
      w
      ```

- iOS/Android 시뮬레이터나 Expo Go 앱에서 실행 가능합니다.
