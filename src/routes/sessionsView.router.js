import { Router } from "express";
import { logged } from "../middlewares/middlewares.js";

const router = Router();

router.get("/", async (req, res) => {
  res.render("index", {
    title: "index",
    style: "styles.css",
    user: req.session.user,
  });
});

router.get("/login", logged, async (req, res) => {
  res.render("login", {
    title: "Login",
    style: "styles.css",
    loginFailed: req.session.loginFailed ?? false,
    registerSuccess: req.session.registerSuccess ?? false,
  });
});

router.get("/register", logged, async (req, res) => {
  res.render("register", {
    title: "Register",
    style: "index.css",
    registerFailed: req.session.registerFailed ?? false,
  });
});

export default router;
