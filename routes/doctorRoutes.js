const express = require("express");
const {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
  prescriptionController,
} = require("../controllers/doctorCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

//POST single doc info
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

//POST update profile
router.post("/updateProfile", authMiddleware, updateProfileController);

//POST get single doc info
router.post("/getDoctorById", authMiddleware, getDoctorByIdController);

//GET Appointments
router.get(
  "/doctor-appointments",
  authMiddleware,
  doctorAppointmentsController
);

//POST Prescription
router.post("/doctor/prescription", authMiddleware, prescriptionController);

//POST Update Status
router.post("/update-status", authMiddleware, updateStatusController);

module.exports = router;
