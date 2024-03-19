const router = require("express").Router();
const authLogin = require("../middlewares/auth");
const { uploadImage } = require("../middlewares/base64");
const calorieController = require("../controllers/calorieController");

router.post(
  "/store-calorie",
  authLogin,
  uploadImage,
  calorieController.storeCalorie
);
router.post("/get-calorie", authLogin, calorieController.getCalorie);
router.post("/summary-calorie", authLogin, calorieController.getSummaryCalorie);

module.exports = router;
