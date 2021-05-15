const db = require("../../db");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = process.env.SALTS || 10;

function generateAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET);
}

exports.register = async (req, res) => {
  let error = {};
  if (req.body.username.trim() == "") {
    error["username"] = "Username is required";
  }
  if (req.body.password.trim() == "") {
    error["password"] = "Password is required";
  }
  if (req.body.confirm_password.trim() == "") {
    error["confirm_password"] = "Confirm Password is required";
  }
  if (req.body.confirm_password.trim() != req.body.password.trim()) {
    error["password"] = "Password doesn't match";
  }

  if (Object.keys(error).length > 0) {
    return res.status(422).send(error);
  }

  try {
    db.User.count({ where: { username: req.body.username.trim() } }).then(
      (count) => {
        if (count != 0) {
          return res.status(422).send({
            username: "Username already exists",
          });
        }
      }
    );

    let hash = await bcrypt.hash(req.body.password.trim(), saltRounds);

    const user = await db.User.create({
      username: req.body.username.trim(),
      password: hash,
    });

    return res.send({
      token: generateAccessToken(
        JSON.stringify({
          id: user.id,
          username: user.username,
        })
      ),
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

exports.login = async (req, res) => {
  let error = {};
  if (req.body.username.trim() == "") {
    error["username"] = "Username is required";
  }
  if (req.body.password.trim() == "") {
    error["password"] = "Password is required";
  }

  if (Object.keys(error).length > 0) {
    return res.status(422).send(error);
  }

  try {
    const user = await db.User.findOne(
      {
        where: { username: req.body.username.trim() },
      },
      {
        attributes: ["username", "password"],
      }
    );

    if (user === null) {
      return res.status(401).send({
        username: "Invalid username",
      });
    }

    bcrypt
      .compare(req.body.password.trim(), user.password)
      .then(function (result) {
        if (!result) {
          return res.status(401).send({
            password: "Invalid password",
          });
        }
        return res.status(201).json({
          token: generateAccessToken(
            JSON.stringify({
              id: user.id,
              username: user.username,
            })
          ),
          user: {
            id: user.id,
            username: user.username,
          },
        });
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};
