import argon2 from "argon2";
import redis from "redis";
import { v4 } from "uuid";
import Config from "../config";
import { errorHandler } from "../utils/errorHandler";
import { sendEmail } from "../utils/sendEmail";

// Constants
const COOKIE_NAME = Config.cookieName;
const CLIENT_URL = Config.api.clientUrl;
const REDIS_URL = Config.api.redisUrl;

const redisClient = redis.createClient(REDIS_URL);

export default {
  Query: {
    // Check if user is logged in
    // User considered logged in if their id is stored in session
    me: (_, __, { models, req }) => {
      const myId = req.session.userId;

      // Return null if not logged in
      if (!myId) return null;

      return models.User.findOne({ where: { id: myId } });
    },
    // Get my user profile
    myProfile: async (_, __, { models, req }) => {
      const myId = req.session.userId;

      // Return null if not logged in
      if (!myId) return null;

      // Get email from User model
      const { email } = await models.User.findOne({ where: { id: myId } });

      // Get user profile
      const { dataValues } = await models.UserProfile.findOne({
        where: { userId: myId },
      });

      return { email, ...dataValues };
    },
    // Get my profile picture
    myProfilePicture: (_, __, { req }) => {
      const picture = req.session.userPictureUrl;

      if (!picture) {
        return null;
      }

      return picture;
    },
    // Get all user profiles
    allUserProfiles: async (_, __, { models }) => {
      const users = await models.User.findAll();
      const profiles = await models.UserProfile.findAll();

      // For each user, find their profile and
      // return needed fields
      const userProfiles = users.map((user) => {
        const { id, email, provider, createdAt } = user;
        // Find user's profile
        const { dataValues } = profiles.find(
          (profile) => profile.userId === id
        );

        // Return merged fields
        return { email, provider, createdAt, ...dataValues };
      });

      return userProfiles;
    },
    // Get array of all user profile IDs
    allUserProfileIds: async (_, __, { models }) => {
      const profiles = await models.UserProfile.findAll();
      return profiles.map((profile) => profile.id);
    },
    // Get user profile with userProfile ID
    getUserProfile: async (_, { id }, { models }) => {
      const { dataValues } = await models.UserProfile.findOne({
        where: { id },
      });

      // Get email, provider and registration date from user model
      const { email, provider, createdAt } = await models.User.findOne({
        where: { id: dataValues.userId },
      });

      // Return merged fields
      return { email, provider, createdAt, ...dataValues };
    },
    // Returns true if email available
    checkEmailAvailability: async (_, { email }, { models }) => {
      const emailExists = await models.User.findOne({ where: { email } });
      if (emailExists) return false;
      return true;
    },
  },
  Mutation: {
    // Register user locally, log them in & return their profile
    register: async (
      _,
      { input: { email, password, picture, name } },
      { models, req }
    ) => {
      try {
        const lowercaseEmail = email.toLowerCase();

        // Check again if email is already registered
        const existingEmail = await models.User.findOne({
          where: { email: lowercaseEmail },
        });

        if (existingEmail) {
          return errorHandler("email", "User with that email already exists.");
        }

        // Validate password
        if (password.length < 5 || password.length > 50) {
          return errorHandler(
            "password",
            "Password must be between 5 and 50 characters long."
          );
        }

        // Hash password with argon2
        const hashedPassword = await argon2.hash(password);

        // Create user
        const user = await models.User.create({
          email: lowercaseEmail,
          password: hashedPassword,
          provider: "local",
        });

        // Create their user profile
        const { dataValues } = await models.UserProfile.create({
          picture,
          name,
          userId: user.id,
        });

        // Update user session & log them in
        req.session.userId = user.id;

        // Update session cache with picture
        req.session.userPictureUrl = picture;

        // Return merged fields
        return {
          profile: {
            email: user.email,
            provider: user.provider,
            ...dataValues,
          },
        };
      } catch (err) {
        // Handle global errors
        return errorHandler(
          "credentials",
          "Something went wrong. Please try a different email."
        );
      }
    },
    // Local user login
    login: async (_, { input: { email, password } }, { models, req }) => {
      const lowercaseEmail = email.toLowerCase();

      // Check if user with email exists
      const user = await models.User.findOne({
        where: { email: lowercaseEmail },
      });

      // Could add a custom email error message but
      // don't want potential hackers to know if email
      // is or is not registered in database
      if (!user) {
        return errorHandler(
          "credentials",
          "Wrong credentials, please try again."
        );
      }

      // Authenticate password
      const isValid = await argon2.verify(user.password, password);

      // Same here, if incorrect credentials,
      // show global error message
      if (!isValid) {
        return errorHandler(
          "credentials",
          "Wrong credentials, please try again."
        );
      }

      // Get profile picture and store in session
      const userProfile = await models.UserProfile.findOne({
        where: { userId: user.id },
      });

      req.session.userPictureUrl = userProfile.picture;

      // Update user session & log them in
      req.session.userId = user.id;

      return { user };
    },
    // Log user out by destroying their session
    logout: (_, __, { req, res }) =>
      new Promise((resolve) => {
        // Destroy redis session
        req.session.destroy((err) => {
          // Clear session cookie
          res.clearCookie(COOKIE_NAME);

          if (err) return resolve(false);

          return resolve(true);
        });
      }),
    // Update my profile
    updateProfile: async (
      _,
      { input: { name, bio, picture } },
      { models, req }
    ) => {
      // Users can only update their profile
      const myId = req.session.userId;

      // Get user
      const profile = await models.UserProfile.findOne({
        where: { userId: myId },
      });

      // Update profile with new fields
      await profile.update({ name, bio, picture });

      // Update session cache with picture
      req.session.userPictureUrl = picture;

      return { profile };
    },
    // Change my password
    changePassword: async (
      _,
      { input: { password, newPassword } },
      { models, req }
    ) => {
      const myId = req.session.userId;

      const user = await models.User.findOne({ where: { id: myId } });

      // Authenticate password
      const isValid = await argon2.verify(user.password, password);

      if (!isValid) {
        return errorHandler("password", "Password doesn't match our records.");
      }

      // Proceed to hash & update password
      user.password = await argon2.hash(newPassword);

      // Update Postgres user entity
      await user.save();

      return { success: true };
    },
    // Change my email
    changeEmail: async (_, { input: { email, password } }, { models, req }) => {
      const myId = req.session.userId;

      // Check if new email is already registered
      const user = await models.User.findOne({ where: { email } });

      if (user) {
        return errorHandler(
          "email",
          "This email isn't available. Try a different one."
        );
      }

      // Get my user
      const myUser = await models.User.findOne({ where: { id: myId } });

      // Authenticate password
      const isValid = await argon2.verify(myUser.password, password);

      if (!isValid) {
        return errorHandler(
          "password",
          "Password is invalid, please try again."
        );
      }

      // Update email with new one
      await myUser.update({ email });

      return { success: true };
    },
    // Send recovery email to update password if email associated
    forgotPassword: async (_, { email }, { models }) => {
      const lowercaseEmail = email.toLowerCase();

      const user = await models.User.findOne({
        where: { email: lowercaseEmail },
      });

      // If no email associated, return email regardless
      // so as to not let hackers know there's an account
      // associated with input credentials
      if (!user) {
        return { success: true };
      }

      // Create token & store in session for 24 hours
      const token = v4();

      redisClient.set(
        `PASSWORD_RESET_${token}`,
        user.id,
        "EX",
        1000 * 60 * 60 * 24
      );

      // Send email with template & reset link
      const subject = "Reset your password - Authentication";
      const html = `<h2>Authentication</h2><p>Let's recover your account. Click on the link below to reset your password.<p/><a href="${CLIENT_URL}/password-reset/${token}">Reset your password</a>`;

      await sendEmail(email, subject, html);

      return { success: true };
    },
    // Reset password by authenticating email token
    resetPassword: async (
      _,
      { input: { token, password } },
      { models, req }
    ) => {
      // Get userId from token stored in session
      const key = `PASSWORD_RESET_${token}`;

      const userId = await new Promise((resolve) => {
        redisClient.get(key, (err, reply) => {
          if (err) {
            console.log(err);
            resolve(null);
          }
          // reply holds value for userId key
          resolve(reply);
        });
      });

      // If userId not found in redis
      if (!userId) {
        return errorHandler(
          "tokenExpired",
          "Token expired. Please re-attempt to recover your password."
        );
      }

      const user = await models.User.findOne({ where: { id: userId } });

      // If user not found in database
      if (!user) {
        return errorHandler("token", "User no longer exists.");
      }

      // Proceed to change passwords
      user.password = await argon2.hash(password);

      // Update Postgres user entity
      await user.save();

      // Delete key from redis to allow only one change of password
      redisClient.del(key);

      // Update user session & log them in
      req.session.userId = user.id;

      return { user };
    },
  },
};
