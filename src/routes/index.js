const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth");
const upload = require("../middleware/upload");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

// AUTH
router.post("/register", authController.register);
router.post("/login", authController.login);

// update profile
router.put("/profile/update", authMiddleware, userController.updateProfile);

// upload image
router.put("/profile/image", authMiddleware, upload.single("file"), userController.uploadProfileImage);

// USER
router.get("/balance", authMiddleware, userController.getBalance);
router.post("/topup", authMiddleware, userController.topUp);
router.post("/transaction", authMiddleware, userController.transaction);

module.exports = router;