import passport from "passport";
import passportLocal from "passport-local";
import UserDBService from "../dao/services/db/UserDBService.js";
import { createHash, isValidPassword } from "../utils/functionsUtil.js";
import GitHubStrategy from "passport-github2";
const LocalStrategy = passportLocal.Strategy;
const userDBService = new UserDBService();
const initPassport = () => {
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: `${process.env.CLIENT_ID}`,
        clientSecret: `${process.env.CLIENT_SECRET}`,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          let user = await userDBService.findUserByUsername(profile._json.login)
          if(!user) {
            let newUser = {
              username: profile._json.login,
              first_name: profile._json.name,
              password: ''
            }
            let result = await userDBService.createUser(newUser)
            done(null, result);
          } else {
            done(null, user);
          }
        } catch(error) {
          return done(error);
        }
      },
    ),
  );

  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;
        try {
          let user = await userDBService.findUserByEmail(email);
          if (user) {
            console.log("User already exists");
            return done(null, false);
          }
          const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
          let result = await userDBService.createUser(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await userDBService.findUserByEmail(email);
          if (!user) {
            console.log("User not found");
            return done(null, false);
          }
          if (!isValidPassword(user, password)) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await userDBService.findUserById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initPassport;
