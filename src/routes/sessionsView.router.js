import { Router } from "express";
import { logged } from "../middlewares/middlewares.js";

const router = Router();

router.get("/", logged, async (req, res) => {
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
