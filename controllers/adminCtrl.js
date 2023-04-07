const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModels");
const eventModel = require("../models/eventModel");

const getAdminInfoController = async (req, res) => {
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

const getAllUsersController = async (req, res) => {
  try {
    const users = await userModel.find({});
    res.status(200).send({
      success: true,
      message: "Users data lists",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching users!",
      error,
    });
  }
};

const updateProfileController = async (req, res) => {
  try {
    const updatedAdmin = await userModel.findOneAndUpdate(
      { _id: req.body.userId },
      req.body,
      { new: true, runValidators: true }
    );
    res.status(201).send({
      success: true,
      message: "Admin Profile Updated",
      data: updatedAdmin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Admin Profile Update Error!",
      error,
    });
  }
};

const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    res.status(200).send({
      success: true,
      message: "Doctors data lists",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching doctors!",
      error,
    });
  }
};

//DOCTOR account status
const changeAccountStatusController = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
    const user = await userModel.findOne({ _id: doctor.userId });
    const notification = user.notification;
    notification.push({
      type: "doctor-account-request-updated",
      message: `your doctor account request has been ${status}`,
      onClickPath: "/notification",
    });
    user.isDoctor = status === "approved" ? true : false;
    await user.save();
    res.status(201).send({
      success: true,
      message: "Account Status Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error Account Status!",
      error,
    });
  }
};

//event ctrl
const eventsController = async (req, res) => {
  try {
    const { subject, message } = req.body;
    const appliedEvents = new eventModel({
      subject,
      message,
    });
    const savedEvent = await appliedEvents.save();
    const obj = {
      id: savedEvent._id,
      subject: savedEvent.subject,
      message: savedEvent.message,
    };
    res.status(200).send({
      success: true,
      message: "Event Notice sent Successfully",
      appliedEvents: obj,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Event",
    });
  }
};

module.exports = {
  getAllDoctorsController,
  getAllUsersController,
  changeAccountStatusController,
  updateProfileController,
  getAdminInfoController,
  eventsController,
};
