import { Avatar, Flex, Heading, Text } from "@chakra-ui/react";
import moment from "moment";
import { withUrqlClient } from "next-urql";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ssrExchange, useQuery } from "urql";
import { Layout } from "../../components/Layout";
import { ProfileSkeleton } from "../../components/Skeletons";
import { GetUserProfile as GetUserProfileQuery } from "../../graphql/queries/user";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { getStaticIds } from "../../utils/getStaticIds";
import { useUser } from "../../utils/useUser";

const Profile = ({ id }) => {
  const [profile, setProfile] = useState(null);

  const { user } = useUser({ redirectTo: "/auth" });

  const { isFallback } = useRouter();

  // Query user profile data
  const [{ data }] = useQuery({
    query: GetUserProfileQuery,
    variables: { id },
  });

  // Destructure data after fetch
  const { name, email, picture, bio, createdAt, provider } = profile || {};

  // Convert time stamp to date string
  const getDateString = (timestamp) => {
    const strTimestamp = parseInt(timestamp);
    return moment(strTimestamp).format("MMM, YYYY");
  };

  // Populate profile object after fetch
  useEffect(() => {
    if (data?.getUserProfile) {
      setProfile(data.getUserProfile);
    }
  }, [data]);

  // Load skeleton until auth or data not loaded
  if (!user?.me || isFallback) {
    return <ProfileSkeleton />;
  }

  return (
    <Layout hideFooter>
      <Head>
        <title>{name} - Auth</title>
      </Head>
      <Flex {...styles.wrapper}>
        <Flex {...styles.content}>
          {/* Avatar */}
          <Flex {...styles.left}>
            <Avatar src={picture} {...styles.avatar} />

            <Heading {...styles.name}>{name}</Heading>

            <Text {...styles.joinedDate}>
              Joined on {getDateString(createdAt)}
            </Text>
          </Flex>

          {/* Display name */}
          <Flex {...styles.right}>
            <Flex {...styles.fieldContainer}>
              <Flex {...styles.field}>
                <Heading {...styles.label}>Display name</Heading>
                <Text {...styles.value} isTruncated textTransform="capitalize">
                  {name}
                </Text>
              </Flex>
            </Flex>

            {/* Email */}
            <Flex {...styles.fieldContainer}>
              <Flex {...styles.field}>
                <Heading {...styles.label}>Email</Heading>
                <Text {...styles.value} isTruncated>
                  {email}
                </Text>
              </Flex>
            </Flex>

            {/* Bio */}
            <Flex {...styles.fieldContainer}>
              <Flex {...styles.field}>
                <Heading {...styles.label}>Bio</Heading>
                <Text {...styles.value} noOfLines="3">
                  {bio || `${name} hasn't updated their bio`}
                </Text>
              </Flex>
            </Flex>

            {/* Registration method */}
            <Flex {...styles.fieldContainer}>
              <Flex {...styles.field}>
                <Heading {...styles.label}>Joined via</Heading>
                <Text {...styles.value} textTransform="capitalize">
                  {provider === "local" ? "Email" : provider}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  );
};

// Statically generate all profile pages at build time
export const getStaticPaths = async () => {
  const ids = await getStaticIds();

  const paths = ids?.map((id) => ({
    params: { id },
  }));

  return {
    paths,
    // Render dynamic pages post build
    fallback: "blocking",
  };
};

// Pass down fetched props
export const getStaticProps = async ({ params }) => {
  const { id } = params;

  const ssrCache = ssrExchange({ isClient: false });

  return {
    props: {
      id,
      // urqlState is a keyword here so withUrqlClient can pick it up.
      urqlState: ssrCache.extractData(),
    },
  };
};

export default withUrqlClient(
  createUrqlClient,
  // Important below so we don't wrap our component in getInitialProps
  { ssr: false }
)(Profile);

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
    width: { base: "90%", md: "75%" },
    padding: { base: "1em", md: "8vh 0" },
  },
  left: {
    flex: { base: 1, md: 1 },
    direction: "column",
    align: "center",
    justify: "center",
    height: "100%",
    padding: "1em",
  },
  avatar: {
    boxSize: "10em",
    boxShadow: "xl",
  },
  name: {
    color: "heading",
    fontSize: { base: "xl", md: "2xl" },
    paddingTop: "1em",
  },
  joinedDate: {
    color: "text",
    paddingY: "0.5em",
  },
  right: {
    flex: { base: 1, md: 2 },
    direction: "column",
    height: "100%",
    width: "100%",
    maxWidth: { base: "100%", md: "35vw" },
    borderRadius: "0.5em",
    background: "secondary",
    padding: { base: "1em", md: "2vw" },
    marginLeft: { base: "none", md: "2vw" },
    marginX: { base: "0", md: "1vw" },
    marginBottom: "2em",
    boxShadow: "lg",
  },
  fieldContainer: {
    direction: "row",
    justify: "space-between",
    align: "center",
    width: "100%",
    padding: { base: "2", md: "1vw" },
  },
  field: {
    flex: "auto",
    direction: "column",
  },
  label: {
    color: "heading",
    fontSize: "lg",
  },
  value: {
    color: "text",
  },
};
