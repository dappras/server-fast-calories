const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

module.exports = {
  userRegister: async (req, res) => {
    const { name, email, password } = req.body;

    try {
      const checkEmail = await User.findOne({ email: email });
      if (checkEmail) {
        return res.json({
          success: false,
          msg: "Email sudah digunakan!!",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const token = jwt.sign({ email: email }, process.env.SECRET_KEY);

      const user = await User.create({
        name,
        email,
        password: hashPassword,
        token,
      });
      return res.json({
        success: true,
        msg: "success create data",
        data: user,
      });
    } catch (e) {
      return res.json({ msg: e.message });
    }
  },

  userLogin: async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email });

      const validpass = await bcrypt.compare(password, user.password);
      if (!validpass) {
        return res.json({
          success: false,
          msg: "Password Anda Salah!!",
        });
      }

      return res.json({
        success: true,
        msg: "Anda Berhasil Login!!",
        token: user.token,
      });
    } catch (error) {
      return res.json({ msg: e.message });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await User.findOne({ token: req.token });

      hasil = {
        name: user.name,
        email: user.email,
      };

      return res.json({
        success: true,
        msg: "success getting data!!",
        data: hasil,
      });
    } catch (e) {
      return res.json({
        success: false,
        msg: e.message,
      });
    }
  },
};
