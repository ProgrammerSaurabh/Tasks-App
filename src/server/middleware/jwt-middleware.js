const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const user = jwt.verify(token, process.env.JWT_SECRET);
      req.user = user;
      return next();
    }

    res.status(401).json({
      message: "Unauthorized!",
    });
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized!",
    });
  }
};
