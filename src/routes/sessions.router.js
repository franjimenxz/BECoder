import { Router } from "express";
import UserDBService from "../dao/services/db/UserDBService.js";
import { isAdmin } from "../middlewares/middlewares.js";
import passport from "passport";

const userDBService = new UserDBService();

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/failregister" }),
  async (req, res) => {
    req.session.registerSuccess = true;
    req.session.loginFailed = false;
    res.redirect("/login");
  },
);
router.get("/failregister", async (req, res) => {
  req.session.registerFailed = true;
  res.status(401).send({ status: "fail", message: "Fail Strategy" });
});
router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/faillogin" }),
  async (req, res) => {
    if (!req.user) {
      return res
        .status(400)
        .send({ status: "error", error: "Invalid credentials" });
    }
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
    };
    req.session.loginFailed = false;
    console.log(req.session);
    res.redirect("/products");
  },
);
router.get("/faillogin", async (req, res) => {
  req.session.loginFailed = true;
  res.status(401).send({ status: "fail", message: "Fail Strategy" });
});
router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {
    res.status(200).send({ status: "success", message: "Success" });
  },
);
router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  },
);
export default router;
