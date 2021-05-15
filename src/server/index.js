const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
const db = require("./db");

app.use(express.json());

require("dotenv").config();

const corsConfig = function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
};

app.use(corsConfig);

app.use("/api", require("./routes/api"));

app.use("/", (req, res) => {
  res.send({ message: "Welcome to todos app" });
});

db.sequelize.sync().then(() => {
  console.log("Drop and re-sync db.");
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
