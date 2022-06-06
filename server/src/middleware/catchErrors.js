import { errorHandler as handleError } from "../utils/errorHandler";

// Catch all server errors to prevent throws

const errorHandler = async (resolve, parent, args, context, info) => {
  try {
    return resolve(parent, args, context, info);
  } catch (err) {
    // Frontend message
    return handleError("server", "Something went wrong. Please try again.");
  }
};

const catchErrors = {
  Query: {
    // User
    me: errorHandler,
    myProfile: errorHandler,
    myProfilePicture: errorHandler,
    allUserProfiles: errorHandler,
    allUserProfileIds: errorHandler,
    getUserProfile: errorHandler,
    checkEmailAvailability: errorHandler,
  },
  Mutation: {
    // User
    login: errorHandler,
    logout: errorHandler,
    updateProfile: errorHandler,
    changePassword: errorHandler,
    changeEmail: errorHandler,
    forgotPassword: errorHandler,
    resetPassword: errorHandler,
  },
};

export { catchErrors };
