import { Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const Logo = () => (
  <Link href="/">
    <Flex {...styles.wrapper}>
      <Heading {...styles.heading}>Authentication</Heading>
    </Flex>
  </Link>
);

export { Logo };

// Styles

const styles = {
  wrapper: {
    width: "100%",
    height: "50%",
    cursor: "pointer",
  },
  heading: {
    color: "heading",
    letterSpacing: "tighter",
    fontSize: "3xl",
  },
};
