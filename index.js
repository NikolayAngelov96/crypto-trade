const express = require("express");
const hbs = require("express-handlebars");
const cookieParser = require("cookie-parser");

const routes = require("./routes");
const { initDb } = require("./config/database");
const { PORT } = require("./constants");
const { auth } = require("./middlewares/authMiddleware");

const app = express();

app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
  })
);

app.set("view engine", "hbs");

app.use(express.urlencoded({ extended: false }));
app.use("/static", express.static("static"));
app.use(cookieParser());

app.use(auth);
app.use(routes);

initDb()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server is listening on Port ${PORT}...`)
    );
    console.log("Database connected!");
  })
  .catch((err) => console.error("Database ERROR!!", err));
