import { tokens } from "./tokens";

export const light_theme = {
  background: tokens.color.lightBg,
  cardBg: tokens.color.lightCardBg,
  color: tokens.color.lightText,
  colorSecondary: tokens.color.lightTextSecondary,
  backgroundPress: tokens.color.lightBackgroundPress,
  borderColor: tokens.color.lightBorder,

  // 테마 색상
  primary: tokens.color.main,
  interactive: tokens.color.lightInfo,

  // 상태 색상
  success: tokens.color.lightSuccess,
  error: tokens.color.lightError,
  warning: tokens.color.lightWarning,
  info: tokens.color.lightInfo,
};

export const dark_theme = {
  background: tokens.color.darkBg,
  cardBg: tokens.color.darkCardBg,
  color: tokens.color.darkText,
  colorSecondary: tokens.color.darkTextSecondary,
  backgroundPress: tokens.color.darkBackgroundPress,
  borderColor: tokens.color.darkBorder,

  // 테마 색상
  primary: tokens.color.main,
  interactive: tokens.color.darkInfo,

  // 상태 색상
  success: tokens.color.darkSuccess,
  error: tokens.color.darkError,
  warning: tokens.color.darkWarning,
  info: tokens.color.darkInfo,
};
