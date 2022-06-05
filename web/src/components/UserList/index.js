import { Avatar, Flex, Heading, Text } from "@chakra-ui/react";
import moment from "moment";
import Link from "next/link";
import React from "react";

const UserList = ({ users }) =>
  users.map(({ id, name, picture, createdAt, provider }, index) => {
    // Convert to right grammar
    const getProvider = (provider) => {
      switch (provider) {
        case "facebook":
          return "with Facebook";
        case "google":
          return "with Google";
        default:
          return "through e-mail";
      }
    };

    // Convert to date format
    const getDateString = (timestamp) => {
      const str = parseInt(timestamp);
      return moment(str).format("MMM DD, YYYY");
    };

    // Randomise language to spice up feed
    const getRandomVerb = () => {
      const verbArr = ["signed up", "joined", "subscribed", "registered"];
      return verbArr[Math.floor(Math.random() * verbArr.length)];
    };

    // A very long descriptive string
    const text = `${name} ${getRandomVerb()} ${getProvider(
      provider
    )} on ${getDateString(createdAt)}`;

    return (
      <Link key={index} href={`profile/${id}`}>
        <Flex {...styles.wrapper}>
          <Flex {...styles.meta}>
            <Heading {...styles.heading}>{name}</Heading>
            <Text {...styles.text} noOfLines="3">
              {text}
            </Text>
          </Flex>

          <Avatar src={picture} {...styles.picture} />
        </Flex>
      </Link>
    );
  });

export { UserList };

// Styles

const styles = {
  wrapper: {
    cursor: "pointer",
    width: "100%",
    borderRadius: "0.5em",
    marginY: "3",
    padding: { base: "1em", md: "min(2vw, 1.5em)" },
    background: "secondary",
    _hover: {
      background: "tertiary",
    },
    _active: {
      background: "secondary",
    },
    boxShadow: "base",
  },
  meta: {
    flex: "auto",
    direction: "column",
    marginRight: "1em",
  },
  heading: {
    color: "heading",
    size: "sm",
  },
  text: {
    color: "text",
  },
  picture: {
    size: "lg",
  },
};
