import { devtoolsExchange } from "@urql/devtools";
import { cacheExchange } from "@urql/exchange-graphcache";
import { dedupExchange, fetchExchange } from "urql";
import Config from "../config";
import {
  AllUserProfiles as AllUserProfilesQuery,
  Me as MeQuery,
} from "../graphql/queries/user";

const SERVER_URL = Config.api.serverUrl;

const createUrqlClient = (ssrExchange) => ({
  url: `${SERVER_URL}/graphql`,
  fetchOptions: {
    credentials: "include",
  },
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    // Normalized caching
    cacheExchange({
      updates: {
        Mutation: {
          changeEmail: (_, __, cache) => {
            // Update my own profile information
            cache.invalidate("Query", "myProfile");
          },
          updateProfile: (result, _, cache) => {
            const { updateProfile } = result;

            // Update profile picture query
            cache.invalidate("Query", "myProfilePicture");

            // Update my own profile information
            cache.invalidate("Query", "myProfile");

            // Manually update all user query
            cache.updateQuery({ query: AllUserProfilesQuery }, (data) => {
              const { allUserProfiles } = data;

              if (updateProfile.errors) {
                return data;
              }

              // Get needed fields
              const user = cache.resolve("Query", "me");
              const id = cache.resolve(user, "id");
              const email = cache.resolve(user, "email");
              const provider = cache.resolve(user, "provider");

              // Filter out old profile
              const profiles = allUserProfiles.filter(
                // UserProfile's userId is the PK for the user model
                (profile) => profile.userId !== id
              );

              // Merge needed fields
              const updatedProfile = {
                ...updateProfile.profile,
                email,
                provider,
              };

              // Add updated profile to cache
              return {
                allUserProfiles: [...profiles, updatedProfile],
              };
            });
          },
          register: (result, _, cache) => {
            const { register } = result;

            // Log user in on register
            cache.updateQuery({ query: MeQuery }, (data) => {
              if (register.errors) {
                return data;
              }
              return {
                me: register.profile,
              };
            });

            // Update profile picture query
            cache.invalidate("Query", "myProfilePicture");

            // Update my own profile information
            cache.invalidate("Query", "myProfile");

            // Manually update query, inefficient to invalidate all users
            cache.updateQuery({ query: AllUserProfilesQuery }, (data) => {
              if (register.errors) {
                return data;
              }

              // Add new user to cache
              return {
                allUserProfiles: [...data.allUserProfiles, register.profile],
              };
            });
          },
          login: (result, _, cache) => {
            const { login } = result;

            // Log user in
            cache.updateQuery({ query: MeQuery }, (data) => {
              if (login.errors) {
                return data;
              }
              return {
                me: login.user,
              };
            });

            // Update profile picture query
            cache.invalidate("Query", "myProfilePicture");

            // Update my own profile information
            cache.invalidate("Query", "myProfile");
          },
          logout: (_, __, cache) => {
            // Log user out
            cache.updateQuery({ query: MeQuery }, () => ({ me: null }));

            // Update profile picture query
            cache.invalidate("Query", "myProfilePicture");

            // Update my own profile information
            cache.invalidate("Query", "myProfile");
          },
        },
      },
    }),
    ssrExchange,
    fetchExchange,
  ],
});

export { createUrqlClient };
