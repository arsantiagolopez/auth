import { Avatar, Button, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import moment from "moment";
import { withUrqlClient } from "next-urql";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { useMutation, useQuery } from "urql";
import { Layout } from "../../components/Layout";
import {
  EmailChangeModal,
  PasswordChangeModal,
  UpdateProfileModal,
} from "../../components/Modals";
import { ProfileSkeleton } from "../../components/Skeletons";
import { Logout as LogoutMutation } from "../../graphql/mutations/user";
import { MyProfile as MyProfileQuery } from "../../graphql/queries/user";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useUser } from "../../utils/useUser";

const Profile = () => {
  const [myProfile, setMyProfile] = useState(null);
  const [activeEdit, setActiveEdit] = useState(null);

  const { user } = useUser({ redirectTo: "/auth" });

  // Destructure data after fetch
  const { picture, name, email, bio, createdAt } = myProfile || {};

  // Query profile data
  const [{ data }] = useQuery({
    query: MyProfileQuery,
  });

  // Logout mutation
  const [, logoutMutation] = useMutation(LogoutMutation);

  // Convert time stamp to date string
  const getDateString = (timestamp) => {
    const strTimestamp = parseInt(timestamp);
    return moment(strTimestamp).format("MMM, YYYY");
  };

  // Populate profile object after fetch
  useEffect(() => {
    if (data?.myProfile) {
      setMyProfile(data.myProfile);
    }
  }, [data]);

  const modalProps = { activeEdit, setActiveEdit };

  // Load skeleton until authentication
  if (!user?.me) {
    return <ProfileSkeleton />;
  }

  return (
    <Layout hideFooter>
      <Head>
        <title>Edit My Profile - Auth</title>
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

          {/* Edit profile information */}
          <Flex {...styles.right}>
            <Flex {...styles.fieldContainer}>
              <Flex {...styles.field}>
                <Heading {...styles.label}>Display name</Heading>
                <Text {...styles.value} isTruncated>
                  {name}
                </Text>
              </Flex>

              <Button {...styles.button} onClick={() => setActiveEdit("name")}>
                Edit
              </Button>
            </Flex>

            <Flex {...styles.fieldContainer}>
              <Flex {...styles.field}>
                <Heading {...styles.label}>Bio</Heading>
                <Text {...styles.value} noOfLines="3">
                  {bio || "Say something nice about yourself"}
                </Text>
              </Flex>

              <Button {...styles.button} onClick={() => setActiveEdit("bio")}>
                Edit
              </Button>
            </Flex>

            <Flex {...styles.fieldContainer}>
              <Flex {...styles.field}>
                <Heading {...styles.label}>Picture URL</Heading>
                <Text {...styles.value} isTruncated>
                  {picture}
                </Text>
              </Flex>

              <Button
                {...styles.button}
                onClick={() => setActiveEdit("picture")}
              >
                Edit
              </Button>
            </Flex>

            {
              // Don't allow OAuth users to change their email or password
              user?.me.provider === "local" && (
                <>
                  <Flex {...styles.fieldContainer}>
                    <Flex {...styles.field}>
                      <Heading {...styles.label}>Email</Heading>
                      <Text {...styles.value} isTruncated>
                        {email}
                      </Text>
                    </Flex>

                    <Button
                      {...styles.button}
                      onClick={() => setActiveEdit("email")}
                    >
                      Edit
                    </Button>
                  </Flex>

                  <Flex {...styles.fieldContainer}>
                    <Flex {...styles.field}>
                      <Heading {...styles.label}>Password</Heading>
                      <Text {...styles.value} isTruncated>
                        ********
                      </Text>
                    </Flex>

                    <Button
                      {...styles.button}
                      onClick={() => setActiveEdit("password")}
                    >
                      Change
                    </Button>
                  </Flex>
                </>
              )
            }

            <Flex {...styles.fieldContainer}>
              <Button
                onClick={() => logoutMutation()}
                {...styles.label}
                {...styles.logout}
              >
                <Text>Log out</Text>
                <Icon
                  as={IoLogOutOutline}
                  color="link"
                  boxSize={{ base: "1em", md: "1.5em" }}
                  marginLeft="3"
                />
              </Button>
            </Flex>

            {/* Absolutely positioned modals */}
            <UpdateProfileModal {...modalProps} />
            <PasswordChangeModal {...modalProps} />
            <EmailChangeModal {...modalProps} />
          </Flex>
        </Flex>
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(Profile);

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
    maxWidth: "75%",
  },
  label: {
    color: "heading",
    fontSize: "lg",
  },
  value: {
    color: "text",
  },
  button: {
    background: "link",
    color: "heading",
    minWidth: "4em",
    size: "sm",
  },
  logout: {
    variant: "ghost",
    color: "link",
    padding: "1",
    width: "100%",
    justifyContent: "space-between",
    _hover: {
      background: "secondary",
    },
    _active: {
      background: "secondary",
    },
  },
};
