import { Avatar, Flex, Icon, Link, Text } from "@chakra-ui/react";
import React from "react";
import { FaGithub } from "react-icons/fa";
import Config from "../../config";

const PORTFOLIO_WEBSITE = Config.portfolio.website;
const PORTFOLIO_PICTURE = Config.portfolio.picture;
const GITHUB_LINK = Config.github.link;

const Footer = ({ hideFooter }) => (
  <Flex {...styles.wrapper} display={hideFooter ? "none" : "flex"}>
    <Link href={PORTFOLIO_WEBSITE} {...styles.link} isExternal>
      <Flex {...styles.leftSideFooter}>
        <Avatar src={PORTFOLIO_PICTURE} {...styles.avatar} />
        <Text {...styles.text}>My portfolio</Text>
      </Flex>
    </Link>

    <Link href={GITHUB_LINK} {...styles.link} isExternal>
      <Icon as={FaGithub} {...styles.icon} />
    </Link>
  </Flex>
);

export { Footer };

// Styles

const styles = {
  wrapper: {
    pointerEvents: "none",
    position: "absolute",
    bottom: "0",
    left: "0",
    width: "100%",
    height: "5em",
    align: "center",
    justify: "space-between",
    paddingY: { base: "1em", md: "min(4em, 6vw)" },
    paddingX: { base: "2em", md: "12vw" },
  },
  leftSideFooter: {
    pointerEvents: "auto",
    align: "center",
  },
  avatar: {
    boxSize: "2em",
  },
  text: {
    display: { base: "none", md: "block" },
    color: "text",
    marginX: "1em",
    _hover: {
      color: "heading",
    },
  },
  icon: {
    pointerEvents: "auto",
    boxSize: "2.3em",
    color: "text",
    cursor: "pointer",
    _hover: {
      color: "heading",
    },
  },
  link: {
    variant: "ghost",
    fontWeight: "medium",
    _hover: {
      textDecoration: "none",
    },
  },
};
