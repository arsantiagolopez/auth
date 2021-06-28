import { Flex, Heading, Icon } from "@chakra-ui/react";
import React from "react";
import { SiMinutemailer } from "react-icons/si";

const SuccessfulEmailSent = ({ email }) => (
  <Flex {...styles.wrapper}>
    <Icon as={SiMinutemailer} {...styles.icon} />
    <Heading {...styles.message}>
      An email was sent to {email}. Follow the instructions to regain access to
      Authentication!
    </Heading>
  </Flex>
);

export { SuccessfulEmailSent };

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
    fontSize: "3em",
  },
};
