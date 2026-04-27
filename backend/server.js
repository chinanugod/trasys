const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const logRoutes = require("./routes/logRoutes");
const authRoutes = require("./routes/authRoutes");

// Initialize app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/logs", logRoutes);
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Connect DB
connectDB();

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});