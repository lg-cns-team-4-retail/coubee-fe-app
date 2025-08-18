import { createTokens } from "tamagui";
import { color, radius, size, space, zIndex } from "@tamagui/themes";

const customColor = {
  // 다크 테마 색상
  darkBg: "#1A1A1A",
  darkText: "#E5E5E5",
  darkCardBg: "#000",
  // 라이트 테마 색상
  lightBg: "#F2F3F7",
  lightText: "#1A1A1A",
  lightCardBg: "#fff",

  // --- 수정된 부분 ---
  // 공통 색상 (다크 모드 기준)
  main: "#4d332f",
  secondary: "#EBDBC6", // 다크 모드용 Secondary
  interactive: "#6495ED", // 다크 모드용 Interactive

  // 라이트 모드용 조정 색상
  lightSecondary: "#D1C5B4", // 라이트 모드용 Secondary
  lightInteractive: "#4A7FE4", // 라이트 모드용 Interactive
  // --- 여기까지 ---
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
