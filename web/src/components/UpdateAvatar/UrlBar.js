import {
  Button,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { GoCheck } from "react-icons/go";

const UrlBar = ({ setIsUrlActive, setImgUrl }) => {
  const [value, setValue] = useState("");

  const handleChange = (event) => setValue(event.target.value);

  const handleConfirm = () => {
    // Set value to inputted url
    setImgUrl(value);
    // Close urlBar
    setIsUrlActive(false);
  };

  return (
    <InputGroup>
      {/* Input bar */}
      <Input
        value={value}
        onChange={handleChange}
        placeholder="Image URL"
        {...styles.input}
      />

      {/* Submit check button */}
      <InputRightElement width="3em">
        <Button onClick={handleConfirm} {...styles.button}>
          <Icon as={GoCheck} {...styles.icon} />
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export { UrlBar };

// Styles

const styles = {
  input: {
    background: "tertiary",
    spellCheck: "false",
    variant: "filled",
    _focus: {
      borderColor: "secondary",
    },
  },
  button: {
    size: "sm",
    background: "secondary",
  },
  icon: {
    color: "green.500",
  },
};
