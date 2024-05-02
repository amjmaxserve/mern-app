const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const consultSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  Specialized_in: {
    type: String,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

consultSchema.pre("save", async function (next) {
  const Consult = this;
  if (!Consult.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(Consult.password, salt);
  Consult.password = hashedPassword;
  next();
});

module.exports = mongoose.model("Consult", consultSchema);
