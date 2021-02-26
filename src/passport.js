import passport from "passport";
import GithubStreategy from "passport-github";
import User from "./models/User";
import { githubLoginCallback } from "./controllers/userController";
import routes from "./routes";

passport.use(User.createStrategy());

passport.use(
  new GithubStreategy(
    {
      clientID: process.env.GH_ID,
      clientSecret: process.env.GH_SECRET,
      callbackURL: process.env.PRODUCTION
        ? `https://wetube2.herokuapp.com${routes.githubCallback}`
        : `http://localhost:4000${routes.githubCallback}`,
    },
    githubLoginCallback
  )
);

//쿠키에 사용자 id를 담고
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
