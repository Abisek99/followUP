const express = require("express");
const {
  getAllDoctorsController,
  getAllUsersController,
  changeAccountStatusController,
  deleteUserController,
  updateProfileController,
  getAdminInfoController,
} = require("../controllers/adminCtrl");

//router object
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

//GET method || USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

//GET method || DOCTORS
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

//POST update profile
router.post("/updateProfile", authMiddleware, updateProfileController);

//POST admin info
router.post("/getAdminInfo", authMiddleware, getAdminInfoController);

//POST ACCOUNT STATUS
router.post(
  "/changeAccountStatus",
  authMiddleware,
  changeAccountStatusController
);

//POST remove user
router.post("/deleteUser", authMiddleware, deleteUserController);

module.exports = router;
