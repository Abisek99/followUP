const express = require("express");
const {
  getAllDoctorsController,
  getAllUsersController,
  changeAccountStatusController,
} = require("../controllers/adminCtrl");

//router object
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

//GET method || USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

//GET method || DOCTORS
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

//POST ACCOUNT STATUS
router.post(
  "/changeAccountStatus",
  authMiddleware,
  changeAccountStatusController
);

module.exports = router;
