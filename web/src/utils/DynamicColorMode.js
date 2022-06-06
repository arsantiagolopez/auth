import { ThemeProvider, useColorMode } from "@chakra-ui/react";
import React from "react";

const DynamicColorMode = ({ children, theme }) => {
  const { colorMode } = useColorMode();

  // Custom colors

  const light = {
    primary:
      "linear-gradient(0deg, rgba(245,245,245,1) 0%, rgba(255,255,255,1) 50%)",
    secondary: "#F8F8F8",
    tertiary: " #F4F4F4",
    heading: "#000000",
    text: "#999999",
    link: "rgba(247, 74, 74, 1)",
  };

  const dark = {
    primary: "rgba(12,14,17,255)",
    secondary: "rgba(21,26,33,255)",
    tertiary: "rgba(37,44,55,255)",
    heading: "rgb(255,255,255)",
    text: "rgba(93,114,144,255)",
    link: "rgba(247, 74, 74, 1)",
  };

  const colors = {
    ...theme.colors,
    ...(colorMode === "dark" ? dark : light),
  };

  const updatedTheme = { ...theme, colors };

  return <ThemeProvider theme={updatedTheme}>{children}</ThemeProvider>;
};

export { DynamicColorMode };
