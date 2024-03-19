const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const calorieSchema = new mongoose.Schema({
  foodName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  calorie: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
  userId: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Calorie", calorieSchema);
