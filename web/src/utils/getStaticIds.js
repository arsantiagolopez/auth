import { initUrqlClient } from "next-urql";
import { cacheExchange, dedupExchange, fetchExchange, ssrExchange } from "urql";
import Config from "../config";
import { AllUserProfileIds as AllUserProfileIdsQuery } from "../graphql/queries/user";

const SERVER_URL = Config.api.serverUrl;

const staticUrqlClient = () =>
  initUrqlClient({
    url: `${SERVER_URL}/graphql`,
    fetchOptions: {
      credentials: "include",
    },
    exchanges: [
      dedupExchange,
      cacheExchange,
      ssrExchange({ isClient: false }),
      fetchExchange,
    ],
  });

const getStaticIds = async () => {
  // Create a basic urql client
  const client = staticUrqlClient();

  // Query all userProfile ids
  const {
    data: { allUserProfileIds },
  } = await client.query(AllUserProfileIdsQuery).toPromise();

  return allUserProfileIds;
};

export { getStaticIds };
