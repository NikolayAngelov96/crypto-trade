const router = require("express").Router();
const authService = require("../services/authService");
const { SESSION_NAME } = require("../constants");
const { isAuth } = require("../middlewares/authMiddleware");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await authService.login(email, password);
    const token = await authService.createToken(user);

    res.cookie(SESSION_NAME, token, { httpOnly: true });

    // Navigate after successful Login
    res.redirect("/");
  } catch (err) {
    res.render("login", { error: err.message });
  }
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  try {
    const createdUser = await authService.register(req.body);
    const token = await authService.createToken(createdUser);

    res.cookie(SESSION_NAME, token, { httpOnly: true });

    res.redirect("/");
  } catch (err) {
    res.render("register", { error: err.message });
  }
});

// isAuth middleware added here
router.get("/logout", isAuth, (req, res) => {
  res.clearCookie(SESSION_NAME);

  res.redirect("/");
});
module.exports = router;
