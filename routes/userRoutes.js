const express = require("express");

const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
  updateProfileController,
  getUserInfoController,
  cancelAppointmentController,
  rescheduleAppointmentController,
  payViaKhaltiController,
  userEventsController,
  userPrescriptionController,
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

//router object
const router = express.Router();

//routes
//LOGIN || POST
router.post("/login", loginController);

//REGISTER || POST
router.post("/register", registerController);

//Auth || POST
router.post("/getUserData", authMiddleware, authController);

//Apply Doctor || POST
router.post("/apply-doctor", authMiddleware, applyDoctorController);

//Notification Doctor || POST
router.post(
  "/get-all-notification",
  authMiddleware,
  getAllNotificationController
);

//Notification Doctor || POST
router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotificationController
);

//GET all Doctor
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

//Book Appointment
router.post("/book-appointment", authMiddleware, bookAppointmentController);

//Cancel Appointment
router.post("/cancel-appointment", authMiddleware, cancelAppointmentController);

//Reschedule Appointment
router.post(
  "/reschedule-appointment",
  authMiddleware,
  rescheduleAppointmentController
);

//Booking Availability Appointment
router.post(
  "/booking-availability",
  authMiddleware,
  bookingAvailabilityController
);

//Appointments List
router.get("/user-appointments", authMiddleware, userAppointmentsController);

//POST update profile
router.post("/updateProfile", authMiddleware, updateProfileController);

//POST user info
router.post("/getUserInfo", authMiddleware, getUserInfoController);

//POST payment
router.post("/payment", authMiddleware, payViaKhaltiController);

//GET Events
router.get("/user-events", authMiddleware, userEventsController);

//GET Prescriptions
router.get("/user-prescriptions", authMiddleware, userPrescriptionController);

module.exports = router;
