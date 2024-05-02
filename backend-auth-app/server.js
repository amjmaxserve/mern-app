const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const userApi = require("./api/userApi");
const ConsultApi = require("./api/ConsultApi");
// Load environment variables from.env file
dotenv.config();

// Initialize Express app
const app = express();

// Add body-parser middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    // Start the server
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Mount user API
app.use("/api", userApi);

// Mount Consult API
app.use("/api", ConsultApi);
