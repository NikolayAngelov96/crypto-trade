const Crypto = require("../models/Crypto");
const { validateCrypto } = require("../utils/validateInput");

exports.getAll = (search = "", paymentMethod) => {
  if (paymentMethod) {
    return Crypto.find({
      name: { $regex: search, $options: "i" },
      paymentMethod,
    });
  } else {
    return Crypto.find({
      name: { $regex: search, $options: "i" },
    });
  }
};

exports.create = (crypto, ownerId) => {
  try {
    validateCrypto(crypto);

    return Crypto.create({ owner: ownerId, ...crypto });
  } catch (err) {
    throw err;
  }
};

exports.updateOne = async (cryptoId, cryptoData) => {
  try {
    validateCrypto(cryptoData);

    return Crypto.findByIdAndUpdate(cryptoId, cryptoData);
  } catch (err) {
    throw err;
  }
};

exports.removeOne = (cryptoId) => Crypto.findByIdAndDelete(cryptoId);

exports.getOne = (cryptoId) => Crypto.findById(cryptoId);

exports.buyCrypto = async (cryptoId, userId) => {
  const crypto = await Crypto.findById(cryptoId);

  crypto.buyCrypto.push(userId);

  await crypto.save();

  return crypto;
};
