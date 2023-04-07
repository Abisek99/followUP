const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");
const axios = require("axios");
const eventModel = require("../models/eventModel");
const prescriptionModel = require("../models/prescriptionModel");
//const { use } = require("../routes/userRoutes");

//register callback
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ message: "User already exists", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Register Successfull", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};
//login callback
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "user not found", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: "Invalid Email or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login ${error.message}` });
  }
};

//auth controller
const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error!",
      success: false,
      error,
    });
  }
};

//Apply Doctor ctrl
const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = await doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    const adminUser = await userModel.findOne({ isAdmin: true });
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for doctor`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Application for Doctor Successfull!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error applying for doctor",
    });
  }
};

//notification controller
const getAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    const seennotification = user.seennotification;
    const notification = user.notification;
    seennotification.push(...notification);
    user.notification = [];
    user.seennotification = notification;
    const updateUser = await user.save();
    res.status(200).send({
      success: true,
      message: "Notification marked as read ",
      data: updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in notification",
    });
  }
};

//delete notification
const deleteAllNotificationController = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notification Delete Successfully ",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in notification delete",
    });
  }
};

//GET all Doctor
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctors lists fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error fetching doctor!",
    });
  }
};

//Book Appointment
const bookAppointmentController = async (req, res) => {
  try {
    req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "New-appointment-request",
      message: `A new Appointment Request from ${req.body.userInfo.name}`,
      onClickPath: "/doctor-appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Booked",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Booking Appointment",
      error,
    });
  }
};

//bookingAvailabilityController
const bookingAvailabilityController = async (req, res) => {
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not available at this time!",
        success: false,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointments available",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Booking",
    });
  }
};

//user Appointment Controller
const userAppointmentsController = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "User Appointments fetch Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in user Appointments",
    });
  }
};

//get user info
const getUserInfoController = async (req, res) => {
  try {
    const user = await userModel.findOne({
      _id: req.body.userId,
      isAdmin: true,
    });
    res.status(200).send({
      success: true,
      message: "data fetch success",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching Details",
      error,
    });
  }
};

//update profile controller
const updateProfileController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: req.body.userId },
      {
        name,
        email,
        password: hashedPassword,
      },
      { new: true, runValidators: true }
    );
    res.status(201).send({
      success: true,
      message: "User Profile Updated",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "User Profile Update Error!",
      error,
    });
  }
};

//cancel appointment controller
const cancelAppointmentController = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status: "cancelled" }
    );
    const user = await userModel.findOne({ _id: appointment.userId });
    const notification = user.notification;
    notification.push({
      type: "Appointment Cancelled",
      message: `Your appointment has been cancelled`,
      onClickPath: "/appointments",
    });

    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Cancelled",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in cancelling appointment",
    });
  }
};

const rescheduleAppointmentController = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status: "pending" }
    );
    const user = await userModel.findOne({ _id: appointment.userId });
    const notification = user.notification;
    notification.push({
      type: "Appointment Rescheduled",
      message: `Your appointment has been Rescheduled`,
      onClickPath: "/appointments",
    });

    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Rescheduled",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Rescheduled appointment",
    });
  }
};

//User fetch events controller
const userEventsController = async (req, res) => {
  try {
    const events = await eventModel.find();
    res.status(200).send({
      success: true,
      message: "Events fetched successfully",
      data: events,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error fetching events",
    });
  }
};

//user prescription controller
const userPrescriptionController = async (req, res) => {
  try {
    const email = req.query.email;
    const prescriptions = await prescriptionModel.find({ email });
    res.status(200).send({
      success: true,
      message: "User prescriptions fetched successfully",
      data: prescriptions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error fetching user prescriptions",
    });
  }
};

//payment controller
const payViaKhaltiController = async (req, res) => {
  try {
    // Retrieve the payment details from the request body
    const { amount, mobile } = req.body;

    // Call the Khalti API to initiate the payment
    const response = await axios.post(
      "https://khalti.com/api/v1/payment/initiate",
      {
        amount,
        mobile,
        productIdentity: "MyProduct",
        productName: "My Product",
      },
      {
        headers: {
          Authorization: "Bearer " + process.env.KHALTI_SECRET_KEY,
        },
      }
    );

    // Return the payment response to the client
    res.status(200).send({
      success: true,
      response: response.data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in initiating Khalti payment",
    });
  }
};

module.exports = {
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
  getUserInfoController,
  updateProfileController,
  cancelAppointmentController,
  rescheduleAppointmentController,
  userEventsController,
  userPrescriptionController,
  payViaKhaltiController,
};
