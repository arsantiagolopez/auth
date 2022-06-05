import { Flex } from "@chakra-ui/react";
import React from "react";
import { Avatar } from "../../components/Avatar";
import { ColorModeSwitch } from "../../components/ColorModeSwitch";
import { Logo } from "../../components/Logo";
import { Searchbar } from "../../components/Searchbar";

const Navigation = ({ hideNavigation }) => (
  <Flex {...styles.wrapper} display={hideNavigation ? "none" : "flex"}>
    {/* Logo */}
    <Flex {...styles.section} {...styles.left}>
      <Logo />
    </Flex>

    {/* Search bar */}
    <Flex {...styles.section} {...styles.center}>
      <Searchbar />
    </Flex>

    {/* Authentication */}
    <Flex {...styles.section} {...styles.right}>
      <ColorModeSwitch />
      <Avatar />
    </Flex>
  </Flex>
);

export { Navigation };

// Styles

const styles = {
  wrapper: {
    zIndex: "5",
    justify: "space-between",
    align: "center",
    width: "100%",
    height: { base: "6em", md: "5em" },
  },
  section: {
    margin: { base: "1em", md: "2vw" },
  },
  left: {
    flex: { base: 3, md: 2 },
    align: "center",
    height: "100%",
  },
  center: {
    flex: { base: 0, md: 5 },
    align: "center",
    justify: "center",
    display: { base: "none", md: "flex" },
  },
  right: {
    flex: { base: 1, md: 3 },
    align: "center",
    justify: "flex-end",
    marginX: "2vw",
  },
};
