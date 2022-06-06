import { Flex } from "@chakra-ui/react";
import React from "react";
import { LoadingOverlay } from "../LoadingOverlay";

const LoadingScreen = () => (
  <Flex {...styles.wrapper}>
    <LoadingOverlay isLoading />
  </Flex>
);

export { LoadingScreen };

// Styles

const styles = {
  wrapper: {
    direction: "column",
    minHeight: "100vh",
    background: "primary",
  },
};
