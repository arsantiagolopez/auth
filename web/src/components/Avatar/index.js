import {
  Avatar as ChakraAvatar,
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SkeletonCircle,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "urql";
import { UserContext } from "../../context/UserContext";
import { Logout as LogoutMutation } from "../../graphql/mutations/user";
import { MyProfilePicture as MyProfilePictureQuery } from "../../graphql/queries/user";
import { handleBlur } from "../../utils/handleBlur";
import { useUser } from "../../utils/useUser";

const Avatar = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [picture, setPicture] = useState(null);
  const [myProfileId, setMyProfileId] = useState(null);

  const { users } = useContext(UserContext);
  const { user } = useUser({ redirectTo: "/auth" });

  const navRef = useRef(null);

  const router = useRouter();

  // Query profile data
  const [{ data }] = useQuery({
    query: MyProfilePictureQuery,
  });

  // Logout mutation
  const [{ fetching: logoutLoading }, logoutMutation] =
    useMutation(LogoutMutation);

  // Logout then redirect
  const handleLogout = async () => {
    await logoutMutation();
    router.push("/auth");
  };

  // Update picture after fetch
  useEffect(() => {
    if (data?.myProfilePicture) {
      setPicture(data.myProfilePicture);
    }
  }, [data]);

  // Get my profile ID
  useEffect(() => {
    // If user is logged in
    if (users && user?.me) {
      const myUser = users.find((profile) => profile.userId === user?.me.id);

      setMyProfileId(myUser?.id);

      // User's picture should never be null
      if (!picture) {
        setPicture(myUser?.picture);
      }
    }
  }, [users, user]);

  // Load skeleton until authentication
  if (!user?.me) {
    return <SkeletonCircle size="3em" />;
  }

  return (
    <Popover isOpen={isNavOpen} {...styles.wrapper}>
      <PopoverTrigger>
        <ChakraAvatar
          onClick={() => setIsNavOpen(true)}
          src={picture}
          {...styles.avatar}
        />
      </PopoverTrigger>

      <PopoverContent
        ref={navRef}
        onBlur={(e) => handleBlur(e, navRef, setIsNavOpen)}
        {...styles.content}
      >
        <PopoverBody {...styles.body}>
          <Link href="/dashboard">
            <Button {...styles.link}>Dashboard</Button>
          </Link>

          <Link href={`/profile/${myProfileId}`}>
            <Button {...styles.link}>My profile</Button>
          </Link>

          <Link href="/profile">
            <Button {...styles.link}>Edit my profile</Button>
          </Link>

          <Button
            onClick={handleLogout}
            isLoading={logoutLoading}
            {...styles.link}
            {...styles.logout}
          >
            Logout
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export { Avatar };

// Styles

const styles = {
  wrapper: {
    placement: "bottom-end",
    outline: "none",
    boxShadow: "none",
  },
  avatar: {
    as: "a",
    size: "md",
    background: "tertiary",
    cursor: "pointer",
    boxShadow: "lg",
  },
  content: {
    direction: "column",
    width: { base: "10em", md: "12em" },
    margin: "0",
    background: "secondary",
    borderColor: "rgba(37,44,55,0.5)",
  },
  body: {
    padding: "0",
  },
  link: {
    width: "100%",
    justifyContent: "flex-start",
    background: "none",
    color: "text",
    size: "md",
    fontWeight: "500",
    _hover: {
      background: "tertiary",
    },
  },
  logout: {
    color: "link",
    size: "md",
    fontWeight: "bold",
  },
};
