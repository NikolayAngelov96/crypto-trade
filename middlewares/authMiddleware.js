const jwt = require("jsonwebtoken");
const { SESSION_NAME, SECRET } = require("../constants");

exports.auth = (req, res, next) => {
  const token = req.cookies[SESSION_NAME];

  if (token) {
    jwt.verify(token, SECRET, (err, decodedToken) => {
      if (err) {
        //  maybe clear cookie res.clearCookie(SESSION_NAME);

        // need global error handling
        // return next();

        console.log(err);
        return res.redirect("404");
      }

      req.user = decodedToken;
      res.locals.user = decodedToken;

      next();
    });
  } else {
    next();
  }
};

exports.isAuth = (req, res, next) => {
  if (!req.user) {
    return res.redirect("/auth/login");
  }

  next();
};
