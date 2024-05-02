const mongoose = require("mongoose");

const BookAppointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Consult_Date: {
    type: Date,
    required: true,
  },
  Consult_Person: {
    type: String,
    required: true,
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("BookAppointment", BookAppointmentSchema);
