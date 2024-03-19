require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authLogin = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token)
    return res.json({
      success: false,
      message: "Access Denied !",
    });

  const user = await User.findOne({ token: token });
  if (!user)
    return res.json({
      success: false,
      message: "Access Denied !",
    });

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified;
    req.token = token;
    next();
  } catch (err) {
    return res.json({
      success: false,
      message: "Invalid Token !",
    });
  }
};

module.exports = authLogin;
