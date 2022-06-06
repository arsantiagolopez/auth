import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery } from "urql";
import { Me as MeQuery } from "../graphql/queries/user";

const useUser = ({ redirectTo = false } = {}) => {
  // Authentication query
  const [{ data: user }] = useQuery({ query: MeQuery });

  const router = useRouter();

  useEffect(() => {
    // If no redirectTo set or fetching, just return
    if (!redirectTo || !user) return;

    // If redirectTo is set, redirect if user not found
    if (redirectTo && !user?.me) {
      router.push(redirectTo);
    }
  }, [user, redirectTo]);

  return { user };
};

export { useUser };
