const express = require("express");
const Calorie = require("../models/calorie");
const User = require("../models/user");
const moment = require("moment");

module.exports = {
  storeCalorie: async (req, res) => {
    try {
      const user = await User.findOne({ token: req.token });

      if (req.fileName == undefined) {
        return res.json({
          success: false,
          msg: "Please upload image",
        });
      }

      const { foodName, calorie } = req.body;

      const hasil = await Calorie.create({
        foodName,
        imageUrl: `images/${req.fileName}`,
        calorie,
        createdAt: moment().format("YYYY-MM-DD"),
        userId: user._id,
      });

      return res.json({
        success: true,
        msg: "success create data",
        data: hasil,
      });
    } catch (e) {
      return res.json({ success: false, msg: e.message });
    }
  },

  getCalorie: async (req, res) => {
    try {
      const user = await User.findOne({ token: req.token });
      const calorieAll = await Calorie.find({ userId: user._id });

      let calorieToday = [];
      let calorieWeek = [];

      calorieAll.forEach((item) => {
        if (item.createdAt != null) {
          if (
            moment(item.createdAt).isSame(moment().format("YYYY-MM-DD"), "day")
          ) {
            calorieToday.push(item);
          }
          if (
            moment(item.createdAt).isBetween(
              moment().startOf("week"),
              moment().endOf("week")
            )
          ) {
            calorieWeek.push(item);
          }
        }
      });

      const hasil = {
        calorieToday: [],
        calorieWeek: [],
        calorieAll: [],
      };

      const { limit } = req.body;
      let iterationToday = 0;
      let iterationWeek = 0;
      let iterationAll = 0;

      if (limit != null) {
        iterationToday =
          limit > calorieToday.length ? calorieToday.length : limit;
        iterationWeek = limit > calorieWeek.length ? calorieWeek.length : limit;
        iterationAll = limit > calorieAll.length ? calorieAll.length : limit;
      } else {
        iterationToday = calorieToday.length;
        iterationWeek = calorieWeek.length;
        iterationAll = calorieAll.length;
      }

      for (let i = 0; i < iterationToday; i++) {
        const item = calorieToday[i];

        const hasilItem = {
          _id: item._id,
          foodName: item.foodName,
          image: `http://10.0.2.2:3000/${item.imageUrl}`,
          calorie: item.calorie,
          createdAt: item.createdAt,
        };

        hasil.calorieToday.push(hasilItem);
      }

      for (let i = 0; i < iterationWeek; i++) {
        const item = calorieWeek[i];

        const hasilItem = {
          _id: item._id,
          foodName: item.foodName,
          image: `http://10.0.2.2:3000/${item.imageUrl}`,
          calorie: item.calorie,
          createdAt: item.createdAt,
        };

        hasil.calorieWeek.push(hasilItem);
      }

      for (let i = 0; i < iterationAll; i++) {
        const item = calorieAll[i];

        const hasilItem = {
          _id: item._id,
          foodName: item.foodName,
          image: `http://10.0.2.2:3000/${item.imageUrl}`,
          // image: `http://localhost:3000/${item.imageUrl}`,
          calorie: item.calorie,
          createdAt: item.createdAt,
        };

        hasil.calorieAll.push(hasilItem);
      }

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

  getSummaryCalorie: async (req, res) => {
    try {
      const user = await User.findOne({ token: req.token });
      const calorieAll = await Calorie.find({ userId: user._id });

      let calorieToday = [];
      let calorieWeek = [];

      calorieAll.forEach((item) => {
        if (item.createdAt != null) {
          if (
            moment(item.createdAt).isSame(moment().format("YYYY-MM-DD"), "day")
          ) {
            calorieToday.push(item);
          }
          if (
            moment(item.createdAt).isBetween(
              moment().startOf("week"),
              moment().endOf("week")
            )
          ) {
            calorieWeek.push(item);
          }
        }
      });

      const hasil = {};

      let totalCalorieToday = 0;
      for (let i = 0; i < calorieToday.length; i++) {
        const item = calorieToday[i];

        if (item.calorie != null) {
          totalCalorieToday += item.calorie;
        }
      }
      hasil.calorieToday = totalCalorieToday;

      let totalCalorieWeek = 0;
      for (let i = 0; i < calorieWeek.length; i++) {
        const item = calorieWeek[i];

        if (item.calorie != null) {
          totalCalorieWeek += item.calorie;
        }
      }
      hasil.calorieWeek = totalCalorieWeek;

      let totalCalorieAll = 0;
      for (let i = 0; i < calorieAll.length; i++) {
        const item = calorieAll[i];

        if (item.calorie != null) {
          totalCalorieAll += item.calorie;
        }
      }
      hasil.calorieAll = totalCalorieAll;

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
