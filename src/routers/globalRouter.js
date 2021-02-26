import express from "express";
import passport from "passport";
import routes from "../routes";
import { home, search } from "../controllers/videoController";
import {
  getLogin,
  postLogin,
  logout,
  getJoin,
  postJoin,
  githubLogin,
  postGithubLogin,
  getMe,
} from "../controllers/userController";
import { onlyPrivate, onlyPublic } from "../middlewares";

const globalRouter = express.Router();

//home
globalRouter.get(routes.home, home);

//search
globalRouter.get(routes.search, search);

//join
globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);

//login
globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

//logout
globalRouter.get(routes.logout, onlyPrivate, logout);

//github
globalRouter.get(routes.github, githubLogin);
globalRouter.get(
  routes.githubCallback,
  passport.authenticate("github", { failureRedirect: "/login" }),
  postGithubLogin
);

//me
globalRouter.get(routes.me, getMe);

export default globalRouter;
