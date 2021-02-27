import passport from "passport";
import routes from "../routes";
import User from "../models/User";

//Join
export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res, next) => {
  const {
    body: { name, email, password, password2 },
  } = req;
  if (password !== password2) {
    req.flash("error", "Passwords don't match");
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      const user = await User({ name, email });
      await User.register(user, password);
      next();
    } catch (error) {
      console.log(error);
    }
  }
};

//Login
export const getLogin = (req, res) => {
  res.render("login", { pageTitle: "Login" });
};
export const postLogin = passport.authenticate("local", {
  failureRedirect: routes.login,
  successRedirect: routes.home,
  successFlash: "Welecome",
  failureFlash: "Can't log in. Check email and/or Password",
});

//githubLogin
export const githubLogin = passport.authenticate("github", {
  successFlash: "Welecome",
  failureFlash: "Can't log in. Check email and/or Password",
});
export const postGithubLogin = (req, res) => {
  res.redirect(routes.home);
};
export const githubLoginCallback = async (_, __, profile, cb) => {
  console.log(profile);
  const {
    _json: { id, avatar_url: avatarUrl, name, email },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      //update
      user.githubId = id;
      user.save();
      return cb(null, user);
    }
    //create
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};

//Logout
export const logout = (req, res) => {
  req.flash("info", "logged out, see you later");
  req.logout();
  res.redirect(routes.home);
};

//me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("videos");
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    res.redirect(routes.home);
  }
};

//userDetail
export const userDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const user = await User.findById(id).populate("videos");
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    req.flash("error", "User not found");
    console.log(error);
    res.redirect(routes.home);
  }
};

//EditProfile
export const getEditProfile = (req, res) =>
  res.render("editProfile", { pageTitle: "Edit Profile" });
export const postEditProfile = async (req, res) => {
  const {
    body: { name, email },
    file,
  } = req;
  console.log(name, email);
  try {
    await User.findByIdAndUpdate(req.user._id, {
      name,
      email,
      avatarUrl: file ? file.location : req.user.avatarUrl,
    });
    req.flash("success", "Profile updated");
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "Can't update profile");
    res.redirect(routes.me);
  }
};

//changePassword
export const getChangePassword = (req, res) =>
  res.render("changePassword", { pageTitle: "Change Password" });

export const postChangePassword = async (req, res) => {
  const {
    body: { oldPassword, newPassword, newPassword1 },
  } = req;
  try {
    if (newPassword !== newPassword1) {
      req.flash("error", "password don't match");
      res.status(400);
      res.redirect(`/users${routes.changePassword}`);
    }
    const user = await User.findById(req.user._id);
    await user.changePassword(oldPassword, newPassword);
    req.flash("success", "change password");
    res.redirect(routes.me);
  } catch (error) {
    req.flash("error", "Can't change password");
    console.log(error);
    res.status(400);
    res.redirect(`/users${routes.changePassword}`);
  }
};
