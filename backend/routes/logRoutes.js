const express = require("express");
const router = express.Router();
const Log = require("../models/Log");

// Create new log entry
router.post("/", async (req, res) => {
  try {
    // Get last S/N
    const lastLog = await Log.findOne().sort({ sn: -1 });
    const nextSN = lastLog ? lastLog.sn + 1 : 1;

    // Create new log
    const newLog = new Log({
      ...req.body,
      sn: nextSN,
      action: req.body.action || "IN", // fallback safety
    });

    const savedLog = await newLog.save();

    res.status(201).json(savedLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Get all logs (with filtering)
router.get("/", async (req, res) => {
  try {
    const { type, action } = req.query;

    let filter = {}; // Start with an empty filter

    if (type) {
      filter.type = type; // Filter by log type (Movement, Vehicle, etc.)
    }

    if (action) {
      filter.action = action; // Filter by IN/OUT
    }

    const logs = await Log.find(filter).sort({ createdAt: -1 }); // Sort by newest first
// Return filtered logs
    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Update log (only certain fields)
router.put("/:id", async (req, res) => {
  const allowedFields = ["remarks"]; // example

  const updates = {};
  for (let key of allowedFields) {
    if (req.body[key]) updates[key] = req.body[key];
  }

  const updated = await Log.findByIdAndUpdate(
    req.params.id,
    updates,
    { new: true }
  );

  res.json(updated);
});

// // Delete log
// router.delete("/:id", async (req, res) => {
//   await Log.findByIdAndDelete(req.params.id);
//   res.json({ message: "Deleted" });
// });

module.exports = router; // this line exports the router object, which contains all the defined routes for handling log-related requests. By exporting the router, we can import it in other parts of our application (such as the main server file) and use it to handle requests to the specified endpoints.