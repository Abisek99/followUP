const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "first Name is required"],
  },
  lastName: {
    type: String,
    required: [true, "last Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  prescription: {
    type: String,
    required: [true, "prescription is required"],
  },
});

const prescriptionModel = mongoose.model("prescriptions", prescriptionSchema);

module.exports = prescriptionModel;
