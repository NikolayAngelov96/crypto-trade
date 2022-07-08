const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET, SALT_ROUNDS } = require("../constants");
const { validateUser } = require("../utils/validateInput");

exports.login = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Cannot find user");
  }

  const isAuthenticated = await bcrypt.compare(password, user.password);

  if (!isAuthenticated) {
    throw new Error("Invalid username or password!");
  }

  return user;
};

exports.register = async ({ username, password, repeatPassword, email }) => {
  try {
    validateUser({ username, password, repeatPassword, email });

    const hashPasword = await bcrypt.hash(password, SALT_ROUNDS);

    return User.create({ password: hashPasword, username, email });
  } catch (err) {
    throw err;
  }
};

exports.createToken = (user) => {
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };

  const options = {
    expiresIn: "2d",
  };

  const tokenPromise = new Promise((resolve, reject) => {
    jwt.sign(payload, SECRET, options, (err, decodedToken) => {
      if (err) {
        return reject(err);
      }

      resolve(decodedToken);
    });
  });

  return tokenPromise;
};
