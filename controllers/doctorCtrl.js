const appointmentModel = require("../models/appointmentModel");
const doctorModel = require("../models/doctorModel");
const userModel = require("../models/userModels");
const prescriptionModel = require("../models/prescriptionModel");

//doctor data
const getDoctorInfoController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Doctor data fetch success",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in fetching Doctor Details",
      error,
    });
  }
};

//UPDATE doctor profile
const updateProfileController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Doctor Profile Updated",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Doctor Profile Update Error!",
      error,
    });
  }
};

//get single doctor
const getDoctorByIdController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.body.doctorId });
    res.status(200).send({
      success: true,
      message: "Single Doctor Info Fetched",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in single doctor info!",
    });
  }
};

//doctor appointments controller
const doctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    const appointments = await appointmentModel.find({
      doctorId: doctor._id,
    });
    res.status(200).send({
      success: true,
      message: "Doctor Appointments fetch Successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Doctor Appointments",
    });
  }
};

const prescriptionController = async (req, res) => {
  try {
    const { firstName, lastName, email, prescription } = req.body;
    const appliedPrescription = new prescriptionModel({
      firstName,
      lastName,
      email,
      prescription,
    });
    const savedPrescription = await appliedPrescription.save();
    const obj = {
      id: savedPrescription._id,
      firstName: savedPrescription.firstName,
      lastName: savedPrescription.lastName,
      email: savedPrescription.email,
      prescription: savedPrescription.prescription,
    };
    res.status(200).send({
      success: true,
      message: "Prescription sent Successfully",
      appliedPrescription: obj,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Prescription",
    });
  }
};

//prescription doctor
// const prescriptionController = async (req, res) => {
//   try {
//     const newPrescription = new prescriptionModel({ ...req.body });
//     await newPrescription.save();
//     const user = await userModel.findOne({ isAdmin: false, isDoctor: false });
//     const notification = user.notification;
//     notification.push({
//       type: "prescription-doctor-request",
//       message: `Doctor has sent a prescription`,
//       data: {
//         prescriptionId: newPrescription._id,
//         name: newPrescription.firstName + " " + newPrescription.lastName,
//         onClickPath: "/user/prescriptions",
//       },
//     });
//     await user.save();
//     res.status(200).send({
//       success: true,
//       message: "Doctor prescription sent successfully!",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       error,
//       message: "Error sending prescription",
//     });
//   }
// };

//appointment status controller
const updateStatusController = async (req, res) => {
  try {
    const { appointmentsId, status } = req.body;
    const appointments = await appointmentModel.findByIdAndUpdate(
      appointmentsId,
      { status }
    );
    const user = await userModel.findOne({ _id: appointments.userId });
    const notification = user.notification;
    notification.push({
      type: "Status Updated",
      message: `your Appointment has been ${status}`,
      onClickPath: "/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Status Updated",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Update Status",
    });
  }
};

module.exports = {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
  doctorAppointmentsController,
  updateStatusController,
  prescriptionController,
};
