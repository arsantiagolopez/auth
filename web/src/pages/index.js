import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { LoadingScreen } from "../components/Screens";
import { createUrqlClient } from "../utils/createUrqlClient";
import { useUser } from "../utils/useUser";
import Dashboard from "./dashboard";

const Index = () => {
  const { user } = useUser({ redirectTo: "/auth" });

  const router = useRouter();

  // If logged in, redirect to dashboard
  useEffect(() => {
    if (user?.me) {
      router.replace("/dashboard");
    }
  }, [user]);

  // Loading spinner until authentication
  if (!user?.me) {
    return <LoadingScreen />;
  }

  return <Dashboard />;
};

export default withUrqlClient(createUrqlClient)(Index);
