const connectDB = require("./config/db");

const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Temporary Test Log model - this will confirm that the model is correctly defined and can be imported without issues.
const Log = require("./models/Log");
console.log("Log model loaded:", Log.modelName);