import { tokens } from "./tokens";

// 라/이트 테마: createTheme 없이 단순 객체로 정의합니다.
export const light_theme = {
  background: tokens.color.lightBg,
  color: tokens.color.lightText,
  primary: tokens.color.main,
  secondary: tokens.color.secondary,
  interactive: tokens.color.interactive,
  borderColor: "#e5e5e5",
  // 여기에 성공, 에러 등 필요한 다른 색상들도 추가할 수 있습니다.
  success: tokens.color.green10,
  error: tokens.color.red10,
};

// 다크 테마: 마찬가지로 단순 객체로 정의합니다.
export const dark_theme = {
  background: tokens.color.darkBg,
  color: tokens.color.darkText,
  primary: tokens.color.main,
  secondary: tokens.color.secondary,
  interactive: tokens.color.interactive,
  borderColor: "#333333",
  success: tokens.color.green10,
  error: tokens.color.red10,
};
