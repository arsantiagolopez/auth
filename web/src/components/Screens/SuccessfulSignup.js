import { Flex, Heading } from "@chakra-ui/react";
import React from "react";

const SuccessfulSignup = () => (
  <Flex {...styles.wrapper}>
    <Heading {...styles.message}>Welcome aboard!</Heading>
    <Heading {...styles.emoji}>👋🏼</Heading>
  </Flex>
);

export { SuccessfulSignup };

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
    fontSize: { base: "3xl", md: "min(2.25em, 3.5vw)" },
  },
  emoji: {
    fontSize: "3em",
    margin: "2",
  },
};
