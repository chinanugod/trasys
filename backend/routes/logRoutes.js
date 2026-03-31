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
    const { type, status } = req.query;

    let filter = {};

    if (type) {
      filter.type = type;
    }

    if (status) {
      filter.status = status;
    }

    const logs = await Log.find(filter).sort({ timeIn: -1 });

    res.json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});


// Check-out log
router.patch("/:id/checkout", async (req, res) => { // what this line does is it defines a PATCH route for the endpoint "/:id/checkout". The ":id" part is a route parameter that will capture the ID of the log entry we want to update. When a PATCH request is made to this endpoint, the server will execute the callback function to handle the request and update the log entry with the specified ID.
  try {
    const log = await Log.findById(req.params.id); // this is the log entry we want to update

    if (!log) {
      return res.status(404).json({ message: "Log not found" });
    }

    // Update fields
    log.timeOut = new Date();
    log.status = "Out";

    const updatedLog = await log.save();

    res.json(updatedLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; // this line exports the router object, which contains all the defined routes for handling log-related requests. By exporting the router, we can import it in other parts of our application (such as the main server file) and use it to handle requests to the specified endpoints.