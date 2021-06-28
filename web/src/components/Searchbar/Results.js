import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const Results = ({ handleBlur, searchRef, setIsSearchFocused, results }) => (
  <Flex
    onBlur={(e) => handleBlur(e, searchRef, setIsSearchFocused)}
    {...styles.wrapper}
    paddingTop={!results.length && "1.25em"}
  >
    {results &&
      results.map(({ id, name, email }, index) => (
        <Link key={index} href={`/profile/${id}`}>
          <Button {...styles.result}>
            <Heading {...styles.name}>{name}</Heading>
            <Text {...styles.email} isTruncated>
              - {email}
            </Text>
          </Button>
        </Link>
      ))}
  </Flex>
);

export { Results };

// Styles

const styles = {
  wrapper: {
    tabIndex: "0",
    position: "absolute",
    zIndex: "-1",
    top: "-0.75em",
    left: "-0.75em",
    width: "calc(100% + 1.5em)",
    minHeight: "calc(100% + 1.5em)",
    maxHeight: "calc(100% + 1.5em + 10em + 7em)",
    background: "secondary",
    borderRadius: "0.5em",
    padding: "4em 1vw 1em 1vw",
    direction: "column",
    boxShadow: "xl",
    border: "1px solid rgba(37,44,55,0.2)",
    borderColor: "rgba(37,44,55,0.2)",
    overflow: "scroll",
  },
  result: {
    variant: "ghost",
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    paddingY: "1em",
    _hover: {
      background: "tertiary",
    },
  },
  name: {
    color: "heading",
    size: "sm",
  },
  email: {
    color: "text",
    paddingLeft: "1",
  },
};
