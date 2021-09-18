import { Flex } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useQuery } from "urql";
import { Feed } from "../components/Feed";
import { Layout } from "../components/Layout";
import { MyProjects } from "../components/MyProjects";
import { ProfileCard } from "../components/ProfileCard";
import { DashboardSkeleton } from "../components/Skeletons";
import Config from "../config";
import { UserProvider } from "../context/UserProvider";
import { MyProfile as MyProfileQuery } from "../graphql/queries/user";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useUser } from "../utils/useUser";

const Dashboard = ({ repos }) => {
  const [myProfile, setMyProfile] = useState(null);
  const { user } = useUser({ redirectTo: "/auth" });

  // Query profile data
  const [{ data }] = useQuery({
    query: MyProfileQuery,
  });

  // Populate profile object after fetch
  useEffect(() => {
    if (data?.myProfile) {
      setMyProfile(data.myProfile);
    }
  }, [data]);

  // Load skeleton until authentication
  if (!user?.me) {
    return <DashboardSkeleton />;
  }

  return (
    <UserProvider>
      <Layout hideFooter>
        <Head>
          <title>Dashboard - Auth</title>
        </Head>
        <Flex {...styles.wrapper}>
          <Flex {...styles.section} {...styles.left}>
            <MyProjects repos={repos} />
          </Flex>

          <Flex {...styles.section} {...styles.center}>
            <Feed />
          </Flex>

          <Flex {...styles.section} {...styles.right}>
            <ProfileCard {...myProfile} />
          </Flex>
        </Flex>
      </Layout>
    </UserProvider>
  );
};

export default withUrqlClient(createUrqlClient)(Dashboard);

// Get & pass user's public repos as props
export const getStaticProps = async () => {
  const GITHUB_USERNAME = Config.github.username;

  const url = `https://api.github.com/users/${GITHUB_USERNAME}/repos`;
  const response = await fetch(url);
  const data = await response.json();

  // Clean up data
  const repos = data.map((repo) => {
    const { id, name, html_url, description } = repo;
    return { id, name, html_url, description };
  });

  return { props: { repos } };
};

// Styles

const styles = {
  wrapper: {
    direction: { base: "column-reverse", md: "row" },
  },
  section: {
    margin: { base: "1em", md: "2vw" },
  },
  left: {
    flex: 2,
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
};
