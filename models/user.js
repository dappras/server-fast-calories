const mongoose = require("mongoose");

const userScheme = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  roles: {
    type: Number,
    required: true,
    default: 0,
  },
  password: {
    type: String,
  },
  token: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
});

module.exports = mongoose.model("User", userScheme);
