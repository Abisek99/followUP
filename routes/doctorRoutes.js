const express = require("express");
const {
  getDoctorInfoController,
  updateProfileController,
} = require("../controllers/doctorCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//POST single doc info
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

//POST update profile
router.post("/updateProfile", authMiddleware, updateProfileController);

module.exports = router;
