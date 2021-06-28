import { extendTheme, theme as chakraTheme } from "@chakra-ui/react";
// Disable Chakra focus outline if not keyboard navigating
import "focus-visible/dist/focus-visible";

// Config

const config = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

// Custom themes

const fonts = {
  ...chakraTheme.fonts,
  heading: "Helvetica",
  text: "Arial",
};

const fontSizes = {
  ...chakraTheme.fontSizes,
  heading: "10rem",
};

const theme = extendTheme({ config, fonts, fontSizes });

export default theme;
