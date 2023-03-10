const express = require("express");
const {
  getAllDoctorsController,
  getAllUsersController,
} = require("../controllers/adminCtrl");

//router object
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

//get method || USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

//get method || DOCTORS
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

module.exports = router;
