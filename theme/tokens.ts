import { createTokens } from "tamagui";
import { color, radius, size, space, zIndex } from "@tamagui/themes";

const customColor = {
  // 기본 배경 및 텍스트
  darkBg: "#121212", // 더 깊은 다크 모드 배경
  darkText: "#E5E5E5",
  darkCardBg: "#1E1E1E", // 카드 배경
  darkBackgroundPress: "#333333",
  darkBorder: "#2A2A2A", // 테두리 색상

  lightBg: "#F2F3F7",
  lightText: "#1A1A1A",
  lightCardBg: "#FFFFFF",
  lightBackgroundPress: "#EAEAEA",
  lightBorder: "#E5E5E5",

  // 주요 색상
  main: "#8E6559",

  // --- [추가] 상태별 색상 토큰 ---
  // 성공(Success)
  lightSuccess: "#28A745",
  darkSuccess: "#3DCC5A",
  // 오류(Error)
  lightError: "#DC3545",
  darkError: "#FF4D4F",
  // 경고(Warning)
  lightWarning: "#FFC107",
  darkWarning: "#FFD666",
  // 정보(Info/Interactive)
  lightInfo: "#007BFF",
  darkInfo: "#409CFF",
  // 보조 텍스트
  lightTextSecondary: "#6c757d",
  darkTextSecondary: "#a9a9a9",
};

export const tokens = createTokens({
  color: {
    ...color,
    ...customColor,
  },
  space,
  size,
  radius,
  zIndex,
});
