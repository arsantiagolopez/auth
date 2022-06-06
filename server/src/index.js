import { ApolloServer, makeExecutableSchema } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import "dotenv-safe/config";
import express from "express";
import session from "express-session";
import { applyMiddleware } from "graphql-middleware";
import redis from "redis";
import Config from "./config";
import { catchErrors, permissions } from "./middleware";
import models from "./models";
import passport from "./passport";
import Resolvers from "./resolvers";
import Schema from "./schema";

// Constants
const CLIENT_URL = Config.api.clientUrl;
const COOKIE_NAME = Config.cookieName;
const NODE_ENV = Config.nodeEnv;
const SESSION_SECRET = Config.sessionSecret;
const PORT = Config.port;
const SERVER_URL = Config.api.serverUrl;
const REDIS_URL = Config.api.redisUrl;
const DOMAIN = Config.api.domain;

// Express server
const app = express();

// Set up Redis Store
const RedisStore = connectRedis(session);
const redisClient = redis.createClient(REDIS_URL);

// Cors configuration
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// Server behind Nginx, "trust proxy" needed to allow cookie forwarding
app.set("trust proxy", 1);

// Session configuration
app.use(
  session({
    name: COOKIE_NAME,
    secret: SESSION_SECRET,
    resave: false,
    // Only save data when needed
    saveUninitialized: false,
    store: new RedisStore({
      client: redisClient,
      disableTouch: true,
    }),
    cookie: NODE_ENV !== "development" && {
      // API domain
      domain: DOMAIN,
      // Lasts 1 year
      maxAge: 1000 * 60 * 60 * 24 * 7 * 4 * 12,
      // Only set cookies in a secure environment HTTPS
      secure: true,
      // Prevents client side JS from reading cookie
      httpOnly: true,
      // Strict same site for cookie protection
      sameSite: "lax",
    },
  })
);

// Passport authentication setup
app.use(passport.initialize());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Facebook Auth
app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

// Custom callback to store userId in session
app.get("/auth/facebook/return", (req, res, next) => {
  passport.authenticate("facebook", (err, user) => {
    // On failure, redirect to auth page
    if (err) {
      console.log(`Something went wrong. Error: ${err}`);
      return res.redirect(`${CLIENT_URL}/auth`);
    }
    if (!user) {
      console.log("No user associated with credentials.");
      return res.redirect(`${CLIENT_URL}/auth`);
    }
    // On success, store userId in session and redirect
    req.logIn(user, (err) => {
      if (err) return next(err);

      req.session.userId = user.dataValues.id;

      return res.redirect(`${CLIENT_URL}/`);
    });
  })(req, res, next);
});

// Google Auth
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

// Custom callback to store userId in session
app.get(
  "/auth/google/return",
  passport.authenticate("google", { failureRedirect: `${CLIENT_URL}/auth` }),
  (req, res, next) => {
    const { user, err } = req;
    // On failure, redirect to auth page
    if (err) {
      console.log(`Something went wrong. Error: ${err}`);
      return res.redirect(`${CLIENT_URL}/auth`);
    }
    if (!user) {
      console.log("No user associated with credentials.");
      return res.redirect(`${CLIENT_URL}/auth`);
    }

    // On success, store userId in session and redirect
    req.logIn(user, (err) => {
      if (err) return next(err);

      req.session.userId = user.dataValues.id;

      return res.redirect(`${CLIENT_URL}/dashboard`);
    });
  }
);

// Make executable schema
const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers,
});

// Start the Apollo server
const server = new ApolloServer({
  // Apply middleware on schema resolvers
  schema: applyMiddleware(executableSchema, catchErrors, permissions),
  context: ({ req, res }) => ({ models, req, res, redisClient }),
});

// Apply server middleware
server.applyMiddleware({
  app,
  // Turn off Apollo Server's cors implementation as
  // custom configuration already set above
  cors: false,
});

// Initialize the database & Launch the server
models.sequelize
  // .sync({ force: true })
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.info(`Server is running at ${SERVER_URL}`);
    });
  })
  .catch((err) => console.error(err.stack));
