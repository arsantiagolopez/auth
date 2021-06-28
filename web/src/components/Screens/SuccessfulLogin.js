import { Flex, Heading } from "@chakra-ui/react";
import React from "react";

const SuccessfulLogin = () => (
  <Flex {...styles.wrapper}>
    <Heading {...styles.message}>Welcome back!</Heading>
    <Heading {...styles.emoji}>👋🏼</Heading>
  </Flex>
);

export { SuccessfulLogin };

// Styles

const styles = {
  wrapper: {
    direction: "column",
    align: "center",
    justify: "center",
    bg: "none",
    width: "100%",
    height: "100%",
    animation: "fadeIn 0.8s ease-in-out",
  },
  message: {
    letterSpacing: "tight",
    color: "heading",
    fontSize: { base: "4xl", md: "min(2.5em, 4vw)" },
  },
  emoji: {
    fontSize: "3em",
    margin: "2",
  },
};
