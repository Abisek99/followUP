const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Event", eventSchema);
