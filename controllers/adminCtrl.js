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

//UPDATE admin profile
// const updateProfileController = async (req, res) => {
//   try {
//     const admin = await userModel.findOneAndUpdate(
//       { userId: req.body.userId },
//       { $set: { name: req.body.name, email: req.body.email } },
//       { new: true }
//       //req.body
//       //{ upsert: true, new: true }
//     );
//     res.status(201).send({
//       success: true,
//       message: "Admin Profile Updated",
//       data: admin,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Admin Profile Update Error!",
//       error,
//     });
//   }
// };

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
      message: `your doctor account request has ${status}`,
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

//deleteworkingSelf
// const deleteUserController = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const user = await userModel.findByIdAndDelete(userId);
//     const notification = user.notification;
//     notification.push({
//       type: "user-account-deleted",
//       message: "account has been deleted",
//       onClickPath: "/notification",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error deleting user!",
//       error,
//     });
//   }
// };

//remove user controller
// const deleteUserController = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     if (req.user.role !== "admin") {
//       return res.status(401).send({
//         success: false,
//         message: "Unauthorized access",
//       });
//     }
//     await userModel.findOneAndDelete({ _id: userId });
//     const notification = {
//       type: "user-account-deleted",
//       message: "account has been deleted",
//       onClickPath: "/",
//     };
//     res.status(201).send({
//       success: true,
//       message: "User Account Deleted",
//       notification: notification,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error Deleting User Account!",
//       error,
//     });
//   }
// };

module.exports = {
  getAllDoctorsController,
  getAllUsersController,
  changeAccountStatusController,
  deleteUserController,
  updateProfileController,
  getAdminInfoController,
};
