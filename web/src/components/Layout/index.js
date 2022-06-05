import { Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { UserProvider } from "../../context/UserProvider";
import { useDimensions } from "../../utils/useDimensions";
import { Footer } from "../Footer";
import { Navigation } from "../Navigation";

const Layout = ({ children, hideNavigation, hideFooter }) => {
  const [screenHeight, setScreenHeight] = useState(null);

  const { height } = useDimensions();

  // Update height post SSR fetch to allow
  // height CSS to work on mount
  useEffect(() => setScreenHeight(height), [height]);

  return (
    <UserProvider>
      <Flex {...styles.wrapper} minHeight={screenHeight}>
        <Navigation hideNavigation={hideNavigation} />
        {children}
        <Footer hideFooter={hideFooter} />
      </Flex>
    </UserProvider>
  );
};

export { Layout };

// Styles

const styles = {
  wrapper: {
    background: "primary",
    direction: "column",
    paddingX: { base: "1em", md: "10vw" },
  },
};
