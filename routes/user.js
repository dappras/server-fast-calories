const router = require("express").Router();
const userController = require("../controllers/userController");
const authLogin = require("../middlewares/auth");
const { uploadImage } = require("../middlewares/base64");

router.post("/register", userController.userRegister);
router.post("/login", userController.userLogin);
router.post("/get-user", authLogin, userController.getUser);
router.post("/get-all-user", authLogin, userController.getAllUser);
router.post("/edit-user", authLogin, uploadImage, userController.editUser);
router.post("/delete-user", authLogin, userController.deleteUser);

module.exports = router;
