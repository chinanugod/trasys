const connectDB = require("./config/db");

const express = require("express"); // Import Express - a popular web framework for Node.js
const cors = require("cors"); // Import CORS - a middleware to enable Cross-Origin Resource Sharing

const app = express();

// Import routes - this will allow us to use the log routes defined in logRoutes.js.
const logRoutes = require("./routes/logRoutes");

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/logs", logRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
const PORT = 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); // Temporary Test Database Connection - this will confirm that the database connection is working correctly.

// Temporary Test Log model - this will confirm that the model is correctly defined and can be imported without issues.
const Log = require("./models/Log");
console.log("Log model loaded:", Log.modelName);
