const express = require("express");
const router = express.Router();
const Log = require("../models/Log");

// Create a new log
router.post("/", async (req, res) => {
  console.log("POST request received");

  try {
    const newLog = new Log(req.body);
    const savedLog = await newLog.save();

    res.status(201).json(savedLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;