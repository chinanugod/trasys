const express = require("express");
const router = express.Router();
const Log = require("../models/Log");

router.post("/", async (req, res) => {
  try {
    const action = req.body.action || "IN";

    const name = req.body.name?.trim();
    const phone = req.body.phone?.toString().trim();

    // ✅ Get LAST log for THIS USER
    const lastUserLog = await Log.findOne({
      name,
      phone,
    }).sort({ createdAt: -1 });

    console.log("LAST USER LOG:", lastUserLog);

    // 🚫 Prevent duplicate IN
    if (action === "IN") {
      if (lastUserLog && lastUserLog.action === "IN") {
        return res.status(400).json({
          message: "User already checked IN. Must check OUT first.",
        });
      }
    }

    // 🚫 Prevent duplicate OUT
    if (action === "OUT") {
      if (!lastUserLog || lastUserLog.action === "OUT") {
        return res.status(400).json({
          message: "User is not currently IN.",
        });
      }
    }

    // ✅ Get S/N separately
    const lastSNLog = await Log.findOne().sort({ sn: -1 });
    const nextSN = lastSNLog ? lastSNLog.sn + 1 : 1;

    const newLog = new Log({
      ...req.body,
      sn: nextSN,
      action,
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

router.delete("/", async (req, res) => {
  console.log("DELETE HIT");
  
   try {
    const result = await Log.deleteMany({});
    console.log("Deleted:", result);

    res.json({ message: "All logs cleared" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; // this line exports the router object, which contains all the defined routes for handling log-related requests. By exporting the router, we can import it in other parts of our application (such as the main server file) and use it to handle requests to the specified endpoints.