import { Button, Flex, Heading } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { FaEnvelope, FaFacebookF, FaGoogle } from "react-icons/fa";
import Config from "../../config";

const SERVER_URL = Config.api.serverUrl;

const Social = ({ slideLeft, handleClick, setIsLocalActive }) => (
  <Flex
    {...styles.wrapper}
    animation={slideLeft && "slideLeft 0.4s ease-in-out"}
  >
    <Heading {...styles.heading}>Hello!</Heading>

    <Flex {...styles.fields}>
      <Link href={`${SERVER_URL}/auth/facebook`}>
        <Button {...styles.button} leftIcon={<FaFacebookF />}>
          Log in with Facebook
        </Button>
      </Link>

      <Link href={`${SERVER_URL}/auth/google`}>
        <Button {...styles.button} leftIcon={<FaGoogle />}>
          Log in with Google
        </Button>
      </Link>
      <Button
        {...styles.button}
        leftIcon={<FaEnvelope />}
        onClick={() => setIsLocalActive(true)}
      >
        Log in via e-mail
      </Button>
    </Flex>

    <Button {...styles.link} onClick={handleClick}>
      Sign up via e-mail
    </Button>
  </Flex>
);

export { Social };

// Styles

const styles = {
  wrapper: {
    height: "100%",
    width: "100%",
    align: "center",
    direction: "column",
  },
  heading: {
    flex: "2",
    letterSpacing: "tight",
    color: "heading",
    fontSize: { base: "5xl", md: "6xl" },
  },
  fields: {
    flex: "3",
    justify: "space-around",
    direction: "column",
    height: "100%",
    width: "100%",
  },
  button: {
    bg: "tertiary",
    color: "heading",
    width: "100%",
  },
  link: {
    flex: "1",
    as: "a",
    variant: "link",
    color: "link",
    cursor: "pointer",
  },
};
