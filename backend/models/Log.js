const mongoose = require("mongoose"); // Import Mongoose - a popular ODM for MongoDB

// Log Schema - this defines the structure of the log documents in the MongoDB collection.
const logSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["Movement", "Device", "WorkAccess"],
  },

  sn: {
    type: Number,
    required: true,
  },

  name: String,
  phone: String,
  companyName: String,
  purpose: String,

  dateIn: Date,
  dateOut: Date,
  qtyIn: Number,
  deviceDescription: String,
  serialNumber: String,

  workArea: String,
  typeOfWork: String,
  accessRefNumber: String,
  authorization: String,
  keyCollection: String,
  apoOnDeskName: String,

  timeIn: {
    type: Date,
    default: Date.now,
  },
  timeOut: Date,

  signIn: String,
  signOut: String,

  remarks: String,

  status: {
    type: String,
    default: "Inside",
  },
});

// Export the Log model - this allows us to use the Log model in other parts of our application, such as in routes or controllers.
module.exports = mongoose.model("Log", logSchema);