// Prevent unauthorized users from doing authenticated actions

import { errorHandler } from "../utils/errorHandler";

const isAuthenticated = async (resolve, parent, args, context, info) => {
  const isLoggedIn = context.req.session.userId;

  if (!isLoggedIn) {
    // Frontend message
    return errorHandler("credentials", "User not authorized.");
  }

  return resolve(parent, args, context, info);
};

const permissions = {
  Query: {
    // User
  },
  Mutation: {
    // User
    logout: isAuthenticated,
    updateProfile: isAuthenticated,
    changePassword: isAuthenticated,
    changeEmail: isAuthenticated,
  },
};

export { permissions };
