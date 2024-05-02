const express = require("express");
const router = express.Router();
const brypt = require("bcrypt");
const cryto = require("crypto");
const { v4: uuidv4 } = require("uuid");

//Consult Models
const Consult = require("../models/consultModel");

//Add Consultent Registration

router.post("/cons_register", async (req, res) => {
  const { name, Specialized_in, age, gender, email, phone, password } =
    req.body;
  if (
    !name ||
    !Specialized_in ||
    !age ||
    !gender ||
    !email ||
    !phone ||
    !password
  ) {
    return res.status(400).json({ message: "Missing Required fields" });
  }

  try {
    const existingConsult = await Consult.findOne({
      $or: [{ name }, { email }, { phone }],
    });
    if (existingConsult) {
      return res
        .status(400)
        .json({ message: "Username or email already exists" });
    }

    const NewConsult = new Consult({
      name,
      Specialized_in,
      age,
      gender,
      email,
      phone,
      password,
    });

    await NewConsult.save();
    res
      .status(200)
      .json({ message: "Consultent Registerd Success", NewConsult });
  } catch (error) {
    console.error("Error Registering Consultent", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
