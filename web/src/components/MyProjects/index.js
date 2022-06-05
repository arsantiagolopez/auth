import { Flex, Heading, Spinner, Text } from "@chakra-ui/react";
import React from "react";

const MyProjects = ({ repos }) => (
  <Flex {...styles.wrapper}>
    <Heading {...styles.heading}>My other projects</Heading>

    <Heading {...styles.subheading}>Sourced from Github</Heading>

    <Flex {...styles.content}>
      {repos ? (
        repos.map(({ id, name, html_url, description }) => (
          <a key={id} href={html_url} target="_blank">
            <Flex {...styles.repo}>
              <Text {...styles.name}>{`/${name}`}</Text>
              <Text {...styles.description} noOfLines={2}>
                {description}
              </Text>
            </Flex>
          </a>
        ))
      ) : (
        <Spinner {...styles.spinner} />
      )}
    </Flex>
  </Flex>
);

export { MyProjects };

// Styles

const styles = {
  wrapper: {
    direction: "column",
    width: "100%",
  },
  heading: {
    color: "heading",
    fontSize: { base: "xl", md: "2xl" },
    fontWeight: "black",
  },
  subheading: {
    color: "text",
    fontWeight: "medium",
    textTransform: "uppercase",
    fontSize: "10pt",
    paddingY: { base: "1em", md: "2em" },
  },
  content: {
    direction: "column-reverse",
    justify: "center",
    align: "center",
    width: "100%",
  },
  repo: {
    direction: "column",
    justify: "center",
    align: "flex-start",
    width: "100%",
    height: "100%",
    paddingY: "1em",
    paddingX: "0",
    _hover: {
      textDecoration: "underline",
      textDecorationColor: "lightgray",
    },
  },
  name: {
    color: "heading",
    fontWeight: "semibold",
    letterSpacing: "tight",
  },
  description: {
    color: "text",
    fontWeight: "normal",
  },
  spinner: {
    fontSize: "1em",
    color: "link",
    padding: "2em",
    margin: "1em",
  },
};
