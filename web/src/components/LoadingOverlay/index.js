import { Flex, Spinner } from "@chakra-ui/react";
import React from "react";

const LoadingOverlay = ({ isLoading }) => (
  <Flex {...styles.wrapper} display={isLoading ? "flex" : "none"}>
    <Spinner {...styles.spinner} />
  </Flex>
);

export { LoadingOverlay };

// Styles

const styles = {
  wrapper: {
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    position: "absolute",
    align: "center",
    justify: "center",
    bg: "rgba(0,0,0,0.7)",
  },
  spinner: {
    color: "link",
    size: "lg",
  },
};
