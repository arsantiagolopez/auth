import { CheckIcon } from "@chakra-ui/icons";
import { Flex, Heading } from "@chakra-ui/react";
import React from "react";

const SuccessfulUpdate = ({ field }) => (
  <Flex {...styles.wrapper}>
    <CheckIcon {...styles.icon} />
    <Heading {...styles.message}>
      Your {field} was successfully changed!
    </Heading>
  </Flex>
);

export { SuccessfulUpdate };

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
    paddingY: "1em",
  },
  message: {
    textAlign: "center",
    letterSpacing: "tight",
    color: "heading",
    size: "md",
    padding: "2em",
    paddingY: "1em",
  },
  icon: {
    color: "green.400",
    fontSize: "2em",
  },
};
