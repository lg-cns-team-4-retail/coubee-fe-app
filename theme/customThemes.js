import { tokens } from "./tokens";

// 라이트 테마: 제안된 색상을 적용한 최종 버전입니다.
export const light_theme = {
  background: tokens.color.lightBg,
  color: tokens.color.lightText,

  // --- 수정된 부분 ---
  primary: tokens.color.main, // (유지) 높은 대비와 브랜드 일관성
  secondary: tokens.color.lightSecondary, // 라이트 모드용 색상으로 변경
  interactive: tokens.color.lightInteractive, // 라이트 모드용 색상으로 변경

  borderColor: "#e5e5e5",
  success: tokens.color.green10,
  error: tokens.color.red10,
  infoText: tokens.color.lightInteractive, // interactive 색상과 통일
  descripttionText: "#808080",
};

// 다크 테마: 기존 색상을 그대로 사용하여 일관성을 유지합니다.
export const dark_theme = {
  background: tokens.color.darkBg,
  color: tokens.color.darkText,
  primary: tokens.color.main,
  secondary: tokens.color.secondary,
  interactive: tokens.color.interactive,
  borderColor: "#333333",
  success: tokens.color.green10,
  error: tokens.color.red10,
  infoText: tokens.color.interactive,
  descripttionText: "#808080",
};
