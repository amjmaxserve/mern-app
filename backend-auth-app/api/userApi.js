const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

//UserModels
const User = require("../models/userModel");
const BookAppointment = require("../models/BookAppointmentModel");

// Add user Register API
router.post("/register", async (req, res) => {
  const { name, age, gender, email, phone, password } = req.body;

  if (!name || !age || !gender || !email || !phone || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ name }, { email }] });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const newUser = new User({ name, age, gender, email, phone, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add user login API
router.post("/login", async (req, res) => {
  // console.log("Login API Called");
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // console.log("Querying User model"); // Add this to see if the model is being queried
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({ message: ` Login Success Welcome ${user.name}!` });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add Forgot password API
router.post("/forgot-password", async (req, res) => {
  console.log("Forgot password API called");

  const { email } = req.body;
  const { newPassword } = req.body;

  console.log("username: ", email);

  if (!email || !newPassword) {
    console.log("Error: Missing required fields");
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    console.log("Querying database for user with email:", email);
    const user = await User.findOne({ email });

    console.log("User:", user);

    if (!user) {
      console.log("Error: User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Updating user password");
    user.password = newPassword;
    await user.save();

    console.log("User password updated");
    res.status(200).json({ message: "User password updated" });
  } catch (error) {
    console.error("Error updating user password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//Book Appointment

router.post("/book-appointment", async (req, res) => {
  console.log("Book Appointment Api Called");

  const { email, Consult_Date, Consult_Person } = req.body;
  console.log("email: ", email);
  console.log("Consult_Date: ", Consult_Date);
  console.log("Consult_Person: ", Consult_Person);

  if (!email || !Consult_Date || !Consult_Person) {
    console.log("Error Missing Required Fields");
    return res.status(400).json({ message: "Missing required Fields" });
  }

  try {
    console.log("Querying database for user with email: ", email);
    const user = await User.findOne({ email }, "_id");
    if (!user) {
      console.log("Error: User not Found");
      return res.status(400).json({ message: "User not Found!" });
    }

    const appointment = new BookAppointment({
      user: user._id,
      Consult_Date,
      Consult_Person,
    });

    await appointment.save();

    res.status(200).json({ message: "Appointment Booked", appointment });
  } catch (error) {
    console.error("Error Booking Appointment", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//View All Appointments
router.get("/appointments", async (req, res) => {
  console.log("Appointments API Called");
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  console.log(email);
  try {
    console.log("Querying database for user with email: ", email);
    const user = await User.findOne({ email }, "_id");

    const appointments = await BookAppointment.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: 0,
          name: "$userDetails.name",
          age: "$userDetails.age",
          gender: "$userDetails.gender",
          email: "$userDetails.email",
          phone: "$userDetails.phone",
          consultDate: "$Consult_Date",
          consultPerson: "$Consult_Person",
        },
      },
    ]);

    if (appointments.length === 0) {
      return res.status(400).json({ message: "no appointments found!.." });
    }
    console.log(appointments);
    res.status(200).json({ message: "My Appointments", appointments });
  } catch (error) {
    console.error("Error Viewing Appointment", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
