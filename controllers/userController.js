const express = require("express");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs-extra");
const path = require("path");
const Calorie = require("../models/calorie");
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
        imageProfile:
          user.imageUrl != undefined
            ? `https://server-fast-calories-dappras.koyeb.app/${user.imageUrl}`
            : null,
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

  getAllUser: async (req, res) => {
    try {
      const user = await User.find();
      const hasil = [];

      user.forEach((item) => {
        if (item.roles != 1) {
          hasil.push({
            id: item._id,
            name: item.name,
            email: item.email,
            roles: item.roles,
            imageProfile:
              item.imageUrl != undefined
                ? `https://server-fast-calories-dappras.koyeb.app/${item.imageUrl}`
                : null,
          });
        }
      });

      return res.json({
        success: true,
        msg: "success getting all user!!",
        data: hasil,
      });
    } catch (e) {
      return res.json({
        success: false,
        msg: e.message,
      });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.body;
      const user = await User.findOne({ _id: id });
      const calorie = await Calorie.find({ userId: id });

      if (calorie.length > 0) {
        calorie.forEach(async (item) => {
          if (item.imageUrl != null && item.imageUrl != "") {
            await fs.unlink(path.join(`public/${item.imageUrl}`));
          }

          await Calorie.findOneAndDelete({ _id: item._id });
        });
      }

      if (user != null) {
        if (user.imageUrl != null && user.imageUrl != "") {
          await fs.unlink(path.join(`public/${user.imageUrl}`));
        }

        await User.findOneAndDelete({ _id: id });
      }

      return res.json({
        success: true,
        msg: "success delete data user",
      });
    } catch (e) {
      return res.json({
        success: false,
        msg: e.message,
      });
    }
  },

  editUser: async (req, res) => {
    try {
      const { email, name, password } = req.body;
      const token = req.token;
      const user = await User.findOne({ token: req.token });

      if (req.fileName === undefined) {
        if (password === undefined) {
          user.name = name;
          user.email = email;
          user.token = token;
        } else {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt);

          user.name = name;
          user.password = hashPassword;
          user.email = email;
          user.token = token;
        }

        await user.save();

        return res.json({
          success: true,
          msg: "success update data",
          data: user,
        });
      } else {
        if (
          user.imageUrl == undefined ||
          user.imageUrl == null ||
          user.imageUrl == ""
        ) {
          user.imageUrl = `images/${req.fileName}`;
        } else {
          await fs.unlink(path.join(`public/${user.imageUrl}`));
          user.imageUrl = `images/${req.fileName}`;
        }
        if (password === undefined) {
          user.name = name;
          user.email = email;
          user.token = token;
        } else {
          const salt = await bcrypt.genSalt(10);
          const hashPassword = await bcrypt.hash(password, salt);

          user.name = name;
          user.password = hashPassword;
          user.email = email;
          user.token = token;
        }

        await user.save();

        return res.json({
          success: true,
          msg: "success update data",
          data: user,
        });
      }
    } catch (e) {
      return res.json({
        success: false,
        msg: e.message,
      });
    }
  },
};
