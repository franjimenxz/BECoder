import { Router } from "express";
import UserDBService from "../../dao/services/db/UserDBService.js";
import { isAdmin } from "../middlewares/middlewares.js";

const userDBService = new UserDBService();

const router = Router();

router.post("/register", isAdmin, async (req, res) => {
  try {
    await userDBService.createUser(req.body);
    req.session.registerSuccess = true;
    res.redirect("/login");
  } catch (error) {
    req.session.registerFailed = true;
    res.redirect("/register");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { first_name, last_name, age } = await userDBService.login(
      email,
      password,
    );

    req.session.user = { first_name, last_name, email, age };
    req.session.loginFailed = false;
    console.log(req.session);
    res.redirect("/products");
  } catch (error) {
    req.session.loginFailed = true;
    req.session.registerSuccess = false;
    res.redirect("/login");
  }
});

router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
export default router;
