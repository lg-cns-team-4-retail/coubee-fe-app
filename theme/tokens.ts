import { createTokens } from "tamagui";
import { color, radius, size, space, zIndex } from "@tamagui/themes";

const customColor = {
  darkBg: "#1A1A1A",
  darkText: "#E5E5E5",
  darkCardBg: "#000",
  darkBackgroundPress: "#333333",

  lightBg: "#F2F3F7",
  lightText: "#1A1A1A",
  lightCardBg: "#fff",
  lightBackgroundPress: "#EEEEEE",

  main: "#8E6559",
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
