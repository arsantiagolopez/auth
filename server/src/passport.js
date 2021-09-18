import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import Config from "./config";
import models from "./models";

// Constants
const FACEBOOK_APP_ID = Config.auth.facebook.id;
const FACEBOOK_APP_SECRET = Config.auth.facebook.secret;
const GOOGLE_CLIENT_ID = Config.auth.google.id;
const GOOGLE_CLIENT_SECRET = Config.auth.google.secret;

// Facebook OAuth
passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/return",
      profileFields: ["id", "email", "name", "picture.width(300)"],
    },
    // Facebook sends back token and profile
    async (_, __, ___, profile, done) => {
      const { id, email, first_name, last_name, picture } =
        profile?._json || {};

      // Find Facebook profile by ID
      const existingUser = await models.User.findOne({ where: { id } });

      // Log user in
      if (existingUser) {
        return done(null, existingUser);
      }

      // Create user
      const user = await models.User.create({
        id,
        email,
        provider: "facebook",
      });

      // Create user's profile
      await models.UserProfile.create({
        userId: id,
        name: `${first_name} ${last_name}`,
        picture: picture?.data?.url,
      });

      // Log user in
      return done(null, user);
    }
  )
);

// Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/return",
    },
    // Facebook sends back token and profile
    async (_, __, ___, profile, done) => {
      const { id, email, displayName, picture, provider } = profile || {};

      // Find Google profile by ID
      const existingUser = await models.User.findOne({ where: { id } });

      // Log user in
      if (existingUser) {
        return done(null, existingUser);
      }

      // Create user
      const user = await models.User.create({ id, email, provider });

      // Create user's profile
      await models.UserProfile.create({
        userId: id,
        name: displayName,
        picture,
      });

      return done(null, user);
    }
  )
);

export default passport;
