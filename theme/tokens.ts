import { createTokens } from "tamagui";
import { color, radius, size, space, zIndex } from "@tamagui/themes";

const customColor = {
  // 다크 테마 색상
  darkBg: "#1A1A1A",
  darkText: "#E5E5E5",
  // 라이트 테마 색상
  lightBg: "#F2F3F7",
  lightText: "#1A1A1A",
  // 공통 색상 (폐하의 색상표)
  main: "#8B5E56",
  secondary: "#F5DEB3",
  interactive: "#6495ED",
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
