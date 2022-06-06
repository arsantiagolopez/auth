import { Flex, Heading, Spinner } from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { useQuery } from "urql";
import { UserContext } from "../../context/UserContext";
import { AllUserProfiles as AllUserProfilesQuery } from "../../graphql/queries/user";
import { SortBy } from "../SortBy";
import { UserList } from "../UserList";

const Feed = () => {
  const { users, setUsers, sortedUsers } = useContext(UserContext);

  // Query all user profiles
  const [{ data }] = useQuery({ query: AllUserProfilesQuery });

  // Populate users object after fetch
  useEffect(() => {
    if (data?.allUserProfiles) {
      setUsers(data.allUserProfiles);
    }
  }, [data]);

  return (
    <Flex {...styles.wrapper}>
      <Flex {...styles.heading}>
        <Heading {...styles.title}>Your feed</Heading>
        <SortBy />
      </Flex>

      <Flex {...styles.content}>
        {users ? (
          <UserList users={sortedUsers} />
        ) : (
          <Spinner {...styles.spinner} />
        )}
      </Flex>
    </Flex>
  );
};

export { Feed };

// Styles

const styles = {
  wrapper: {
    align: "flex-start",
    width: "100%",
    direction: "column",
  },
  heading: {
    direction: "row",
    justify: "space-between",
    align: "center",
    width: "100%",
  },
  title: {
    color: "heading",
    fontSize: { base: "xl", md: "2xl" },
    fontWeight: "black",
    paddingX: { base: "0", md: "0.5em" },
  },
  button: {
    background: "link",
    color: "heading",
    size: "md",
    borderRadius: "0.5em",
  },
  content: {
    direction: "column",
    width: "100%",
    marginY: "1em",
    align: "center",
  },
  spinner: {
    color: "link",
    padding: "2em",
    margin: "1em",
  },
};
