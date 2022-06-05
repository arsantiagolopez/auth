import { Avatar, Button, Flex, Heading, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

const ProfileCard = ({ id, picture, name, email, bio }) => (
  <Link href={`profile/${id}`}>
    <Flex {...styles.wrapper}>
      <Flex {...styles.profile}>
        <Avatar src={picture} name={name} {...styles.picture} />
        <Flex {...styles.meta}>
          <Heading {...styles.name}>{name}</Heading>
          <Text {...styles.email} isTruncated noOfLines="1">
            {email}
          </Text>
        </Flex>
      </Flex>

      {bio && (
        <Flex {...styles.bio}>
          <Text {...styles.text}>{bio}</Text>
        </Flex>
      )}

      <Link href="/profile">
        <Button {...styles.button} paddingTop={!bio && "1em"}>
          Edit my profile
        </Button>
      </Link>
    </Flex>
  </Link>
);

export { ProfileCard };

// Styles

const styles = {
  wrapper: {
    width: "100%",
    align: "flex-start",
    direction: "column",
    borderRadius: "0.5em",
    background: "secondary",
    minHeight: "10em",
    padding: { base: "1em", md: "min(2vw, 1.5em)" },
    cursor: "pointer",
    boxShadow: "base",
  },
  profile: {
    flex: 3,
    direction: "row",
    align: "center",
    width: "100%",
    overflowX: "hidden",
  },
  picture: {
    boxSize: { base: "4em", md: "5vw" },
    background: "tertiary",
  },
  meta: {
    flex: "auto",
    align: "flex-start",
    justify: "center",
    direction: "column",
    marginLeft: "1em",
    width: "100%",
  },
  name: {
    color: "heading",
    size: "sm",
  },
  email: {
    color: "text",
  },
  bio: {
    paddingY: "1em",
  },
  text: {
    color: "text",
  },
  button: {
    size: "sm",
    variant: "link",
    color: "heading",
  },
};
