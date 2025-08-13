import { createAnimations } from "@tamagui/animations-react-native";
import { createInterFont } from "@tamagui/font-inter";
import { shorthands } from "@tamagui/shorthands";
import { tokens, themes as defaultThemes } from "@tamagui/themes";
import { defaultConfig } from "@tamagui/config/v4";

import { createTamagui } from "tamagui";
import { light_theme, dark_theme } from "./theme/customThemes";
const animations = createAnimations({
  bouncy: {
    type: "spring",
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  lazy: {
    type: "spring",
    damping: 20,
    stiffness: 60,
  },
  quick: {
    type: "spring",
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
});
const headingFont = createInterFont();
const bodyFont = createInterFont();
const config = createTamagui({
  animations: animations,
  defaultTheme: "dark",
  shouldAddPrefersColorThemes: false,
  themeClassNameOnRoot: false,
  shorthands,
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  themes: {
    ...defaultThemes,
    light: light_theme,
    dark: dark_theme,
  },
  tokens,
});
export type AppConfig = typeof config;
declare module "tamagui" {
  interface TamaguiCustomConfig extends AppConfig {}

  interface ThemeValueFallback {
    primary: unknown;
    secondary: unknown;
    interactive: unknown;
  }
}
export default config;
