const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModels");

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

//inactive user account
const deleteUserController = async (req, res) => {
  try {
    const { userId } = req.body;

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "User account inactivated!",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error updating user!",
      error,
    });
  }
};

module.exports = {
  getAllDoctorsController,
  getAllUsersController,
  changeAccountStatusController,
  deleteUserController,
  updateProfileController,
  getAdminInfoController,
};
