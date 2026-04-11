const express = require("express");
const router = express.Router();
const Log = require("../models/Log");


// Create a new log (with auto S/N)
router.post("/", async (req, res) => {
  console.log("POST request received");

  try {
    // Find last log by S/N
    const lastLog = await Log.findOne().sort({ sn: -1 });

    // Generate next S/N
    const nextSN = lastLog ? lastLog.sn + 1 : 1;

    // Create new log with auto SN
    const newLog = new Log({
      ...req.body,
      sn: nextSN,
      action: req.body.action || "IN", // default to IN if not provided
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

    let filter = {};

    if (type) {
      filter.type = type;
    }

    if (action) {
      filter.action = action; // Filter by IN/OUT
    }

    const logs = await Log.find(filter).sort({ createdAt: -1 });

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