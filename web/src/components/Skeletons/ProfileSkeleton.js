import { Flex, Skeleton, SkeletonCircle } from "@chakra-ui/react";
import React from "react";
import { Layout } from "../Layout";

const ProfileSkeleton = () => (
  <Layout hideFooter>
    <Flex {...styles.wrapper}>
      <Flex {...styles.content}>
        <Flex {...styles.section} {...styles.left}>
          <SkeletonCircle {...styles.skeletonCircle} />
          <Skeleton
            {...styles.skeleton}
            height="2em"
            width="75%"
            marginBottom="0.5em"
          />
          <Skeleton {...styles.skeleton} height="2em" width="50%" />
        </Flex>

        <Flex {...styles.section} {...styles.right}>
          <Skeleton {...styles.skeleton} height="50vh" minHeight="10em" />
        </Flex>
      </Flex>
    </Flex>
  </Layout>
);

export { ProfileSkeleton };

// Styles

const styles = {
  wrapper: {
    justify: "center",
    align: "center",
    minHeight: { base: "100%", md: "70vh" },
  },
  content: {
    direction: { base: "column", md: "row" },
    align: "center",
    width: { base: "100%", md: "75%" },
    padding: { base: "1em", md: "8vh 0" },
  },
  left: {
    flex: { base: 1, md: 1 },
    direction: "column",
    align: "center",
    justify: "center",
    height: "100%",
    padding: "1em",
    width: "100%",
  },
  right: {
    flex: { base: 1, md: 2 },
    direction: "column",
    height: "100%",
    width: "100%",
    maxWidth: { base: "100%", md: "35vw" },
    borderRadius: "0.5em",
    marginLeft: { base: "none", md: "2vw" },
    marginX: { base: "0", md: "1vw" },
    marginTop: "2em",
  },
  skeleton: {
    width: "100%",
    marginBottom: "1.5em",
    startColor: "secondary",
    endColor: "tertiary",
    borderRadius: "0.5em",
  },
  skeletonCircle: {
    size: "10em",
    marginBottom: "1em",
    startColor: "secondary",
    endColor: "tertiary",
  },
};
