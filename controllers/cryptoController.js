const router = require("express").Router();
const cryptoService = require("../services/cryptoService");
const { isAuth } = require("../middlewares/authMiddleware");
const { getErrorMessage } = require("../utils/errorHelpers");

router.get("/", async (req, res) => {
  const crypto = await cryptoService.getAll().lean();
  res.render("crypto/catalog", { crypto });
});

router.get("/create", isAuth, (req, res) => {
  res.render("crypto/create");
});

router.post("/create", isAuth, async (req, res) => {
  try {
    const ownerId = req.user._id;

    await cryptoService.create(req.body, ownerId);

    res.redirect("/crypto");
  } catch (err) {
    let message = getErrorMessage(err);
    res.render("crypto/create", { error: message, ...req.body });
  }
});

router.get("/details/:id", async (req, res) => {
  const crypto = await cryptoService.getOne(req.params.id).lean();

  let isOwner = req.user?._id == crypto.owner;

  let isBought = crypto.buyCrypto.some((x) => x._id == req.user?._id);

  res.render("crypto/details", { ...crypto, isOwner, isBought });
});

router.get("/edit/:id", isAuth, async (req, res) => {
  try {
    const crypto = await cryptoService.getOne(req.params.id).lean();

    if (!crypto) {
      throw new Error("No such crypto in database");
    }

    if (crypto.owner != req.user?._id) {
      throw new Error("You do not have permission to edit");
    }

    res.render("crypto/edit", { ...crypto });
  } catch (err) {
    let message = getErrorMessage(err);
    res.render("404", { error: message });
  }
});

router.post("/edit/:id", isAuth, async (req, res) => {
  try {
    await cryptoService.updateOne(req.params.id, req.body);

    res.redirect(`/crypto/details/${req.params.id}`);
  } catch (err) {
    let message = getErrorMessage(err);
    res.render("crypto/edit", { error: message, ...req.body });
  }
});

router.get("/delete/:id", isAuth, async (req, res) => {
  try {
    const crypto = await cryptoService.getOne(req.params.id).lean();

    if (!crypto) {
      throw new Error("No such crypto in database");
    }

    if (crypto.owner != req.user?._id) {
      throw new Error("Authorization failed");
    }

    await cryptoService.removeOne(req.params.id);

    res.redirect("/crypto");
  } catch (err) {
    let message = getErrorMessage(err);
    res.render("404", { error: message });
  }
});

router.get("/buy/:id", isAuth, async (req, res) => {
  try {
    await cryptoService.buyCrypto(req.params.id, req.user._id);

    res.redirect(`/crypto/details/${req.params.id}`);
  } catch (err) {
    let message = getErrorMessage(err);
    res.render("404", { error: message });
  }
});

router.get("/search", async (req, res) => {
  const { search, paymentMethod } = req.query;
  const crypto = await cryptoService.getAll(search, paymentMethod).lean();

  res.render("crypto/search", { crypto, search });
});
module.exports = router;
