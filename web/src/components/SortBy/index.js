import { CheckIcon } from "@chakra-ui/icons";
import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import React, { useContext, useRef, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { handleBlur } from "../../utils/handleBlur";

const SortBy = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { sortBy, setSortBy } = useContext(UserContext);

  const sortRef = useRef(null);

  return (
    <Popover isOpen={isOpen} {...styles.wrapper}>
      <PopoverTrigger>
        <Button onClick={() => setIsOpen(true)} {...styles.button}>
          Sort by
        </Button>
      </PopoverTrigger>

      <PopoverContent
        ref={sortRef}
        onBlur={(e) => handleBlur(e, sortRef, setIsOpen)}
        {...styles.content}
      >
        <PopoverBody {...styles.body}>
          <Button
            {...styles.option}
            color={(sortBy === "date" && "link") || "text"}
            onClick={() => setSortBy("date")}
          >
            Date
            {sortBy === "date" && <CheckIcon fontSize="0.75em" />}
          </Button>

          <Button
            {...styles.option}
            color={(sortBy === "name" && "link") || "text"}
            onClick={() => setSortBy("name")}
          >
            Name
            {sortBy === "name" && <CheckIcon fontSize="0.75em" />}
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export { SortBy };

// Styles

const styles = {
  wrapper: {
    placement: "bottom-end",
    outline: "none",
    boxShadow: "none",
  },
  button: {
    background: "link",
    color: "white",
    size: "md",
    borderRadius: "0.5em",
    _focus: {
      background: "link",
    },
    _hover: {
      background: "link",
    },
  },
  content: {
    direction: "column",
    width: { base: "8em", md: "9em" },
    margin: "0",
    background: "secondary",
    borderColor: "rgba(37,44,55,0.5)",
    marginTop: "-1",
  },
  body: {
    padding: "0",
  },
  option: {
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    background: "none",
    size: "md",
    fontWeight: "500",
    _hover: {
      background: "tertiary",
    },
  },
};
