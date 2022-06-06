import { Flex, Icon, useColorMode } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaMoon } from "react-icons/fa";
import { IoIosSunny } from "react-icons/io";
import { useDelay } from "../../utils/useDelay";

const ColorModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [scaleOut, setScaleOut] = useState(false);

  const handleTransition = async () => {
    setScaleOut(true);

    // Wait for animation
    await useDelay(150);

    // Change color mode
    toggleColorMode();

    setScaleOut(false);
  };

  return (
    <Flex {...styles.wrapper}>
      <Flex onClick={handleTransition}>
        {colorMode === "dark" ? (
          <Icon
            as={FaMoon}
            {...styles.icon}
            animation={scaleOut && "scaleOut 0.2s ease-in-out"}
          />
        ) : (
          <Icon
            as={IoIosSunny}
            {...styles.icon}
            animation={scaleOut && "scaleOut 0.2s ease-in-out"}
          />
        )}
      </Flex>
    </Flex>
  );
};

export { ColorModeSwitch };

// Styles

const styles = {
  wrapper: {
    userSelect: "none",
    align: "center",
    justify: "center",
    marginX: { base: "2", md: "1em" },
    cursor: "pointer",
  },
  icon: {
    boxSize: "1.25em",
    userSelect: "none",
    transition: "all 0.1s ease-in-out",
  },
};
