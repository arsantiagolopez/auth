import { Avatar as ChakraAvatar, Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { GoCheck, GoX } from "react-icons/go";

const Avatar = ({
  imgUrl,
  setIsUrlActive,
  setIsValidUrl,
  isValidUrl,
  errors,
}) => (
  <Flex {...styles.wrapper}>
    <ChakraAvatar
      src={imgUrl}
      onClick={() => setIsUrlActive(true)}
      onLoad={() => setIsValidUrl(true)}
      onError={() => setIsValidUrl(false)}
      {...styles.avatar}
    />

    {isValidUrl && <Icon as={GoCheck} color="green.400" {...styles.icon} />}

    {!isValidUrl && isValidUrl !== null && (
      <Icon
        as={GoX}
        color="link"
        {...styles.icon}
        bottom={errors && errors.picture ? "1em" : "-1em"}
      />
    )}

    {errors && errors.picture && (
      <Text {...styles.error}>{errors.picture.message}</Text>
    )}
  </Flex>
);

export { Avatar };

// Styles

const styles = {
  wrapper: {
    position: "relative",
    width: "100%",
    align: "center",
    direction: "column",
  },
  input: {
    variant: "filled",
    _focus: {
      borderColor: "secondary",
    },
  },
  avatar: {
    size: "2xl",
    cursor: "pointer",
    background: "tertiary",
  },
  icon: {
    position: "absolute",
    boxSize: "3em",
    bottom: "-1em",
  },
  error: {
    fontSize: "sm",
    color: "link",
    paddingTop: "1",
    paddingBottom: "2",
    paddingX: "1",
    lineHeight: "1em",
  },
};
