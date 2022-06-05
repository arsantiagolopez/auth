import { Flex, Skeleton } from "@chakra-ui/react";
import React from "react";
import { Layout } from "../Layout";

const DashboardSkeleton = () => (
  <Layout hideFooter>
    <Flex {...styles.wrapper}>
      <Flex {...styles.section} {...styles.left}>
        <Skeleton {...styles.skeleton} height="2.5em" marginBottom="2em" />
        <Skeleton {...styles.skeleton} height="1.5em" marginBottom="2em" />
        {Array(3)
          .fill()
          .map((_, index) => (
            <Skeleton key={index} {...styles.skeleton} height="5em" />
          ))}
      </Flex>

      <Flex {...styles.section} {...styles.center}>
        <Flex direction="row" justify="space-between" paddingBottom="1em">
          <Skeleton {...styles.skeleton} height="2.5em" width="10em" />
          <Skeleton {...styles.skeleton} height="2.5em" width="7em" />
        </Flex>
        {Array(4)
          .fill()
          .map((_, index) => (
            <Skeleton key={index} {...styles.skeleton} height="7em" />
          ))}
      </Flex>

      <Flex {...styles.section} {...styles.right}>
        <Skeleton {...styles.skeleton} height="12em" width="100%" />
      </Flex>
    </Flex>
  </Layout>
);

export { DashboardSkeleton };

// Styles

const styles = {
  wrapper: {
    direction: { base: "column-reverse", md: "row" },
    paddingY: "2em",
  },
  section: {
    margin: { base: "1em", md: "2vw" },
    direction: "column",
  },
  left: {
    flex: 2,
    direction: "column",
    order: { base: 1, md: 1 },
    maxWidth: { base: "100%", md: "calc(80vw * .20)" },
    minWidth: "12em",
    position: { base: "static", md: "sticky" },
    top: "3em",
    height: "80vh",
    paddingBottom: "2em",
  },
  center: {
    flex: 5,
    order: { base: 2, md: 2 },
    minWidth: "10em",
  },
  right: {
    flex: 3,
    order: { base: 3, md: 3 },
    maxWidth: { base: "100%", md: "calc(80vw * .30 - 2vw)" },
    minWidth: "10em",
    direction: "column",
    position: { base: "static", md: "sticky" },
    top: "3em",
    height: "100%",
  },
  skeleton: {
    width: "100%",
    marginBottom: "1.5em",
    startColor: "secondary",
    endColor: "tertiary",
    borderRadius: "0.5em",
  },
};
