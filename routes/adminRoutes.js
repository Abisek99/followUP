const express = require("express");
const {
  getAllDoctorsController,
  getAllUsersController,
  changeAccountStatusController,
  updateProfileController,
  getAdminInfoController,
  eventsController,
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
//router.post("/deleteUser", authMiddleware, deleteUserController);

//POST method || events
router.post("/events", authMiddleware, eventsController);

module.exports = router;
