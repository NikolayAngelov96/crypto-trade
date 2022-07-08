const mongoose = require("mongoose");

const connectionString = "mongodb://0.0.0.0:27017/crypto";

exports.initDb = () => mongoose.connect(connectionString);
