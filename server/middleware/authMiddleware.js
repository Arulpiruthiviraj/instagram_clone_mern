const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  const jwtSecret = process.env.JWT_SECRET;

  if (!token) {
    return res.status(401).json({ msg: "You must be logged in to continue" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "You must be logged in to continue" });
  }
};
