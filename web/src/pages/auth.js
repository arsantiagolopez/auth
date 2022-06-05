import { Flex } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { Login } from "../components/Login";
import { Signup } from "../components/Signup";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useDelay } from "../utils/useDelay";
import { useDimensions } from "../utils/useDimensions";
import { useUser } from "../utils/useUser";

const Auth = () => {
  const [screenHeight, setScreenHeight] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [slideLeft, setSlideLeft] = useState(false);

  const { user } = useUser({ redirectTo: "/auth" });

  const { height } = useDimensions();

  const router = useRouter();

  const handleClick = async () => {
    // If login active, slide out left
    if (isLogin) setSlideLeft(true);
    // If signup active, slide out right
    else setSlideLeft(false);

    // Wait for animation to run
    await useDelay(300);

    setIsLogin(!isLogin);
  };

  const props = {
    handleClick,
    slideLeft,
  };

  // If logged in, redirect to dashboard
  useEffect(async () => {
    if (user?.me) {
      // Match login & signup screen's message delay
      await useDelay(1500);
      router.replace("/dashboard");
    }
  }, [user]);

  // Update height post SSR fetch to allow
  // height CSS to work on mount
  useEffect(() => setScreenHeight(height), [height]);

  return (
    <Layout hideNavigation>
      <Head>
        <title>Auth</title>
      </Head>
      <Flex {...styles.wrapper} height={screenHeight}>
        <Flex {...styles.content}>
          {isLogin ? <Login {...props} /> : <Signup {...props} />}
        </Flex>
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Auth);

// Styles

const styles = {
  wrapper: {
    align: "center",
    justify: "center",
    width: "100%",
    background: "primary",
  },
  content: {
    align: "center",
    width: "30%",
    minWidth: "20em",
    height: "50%",
    minHeight: "20em",
    background: "secondary",
    borderRadius: "1em",
    paddingY: { base: "3em", md: "3vw" },
    paddingX: { base: "2em", md: "max(2.5em, 3vw)" },
    overflowX: "hidden",
  },
};
