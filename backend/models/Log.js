 const mongoose = require("mongoose");

// Log Schema
const logSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["Movement", "Device", "WorkAccess"],
    },

    sn: {
      type: Number,
      required: true,
    },

    // Movement / General
    name: String,
    phone: String,
    companyName: String,
    purpose: String,
    contactPerson: String,

    // Device Log
    dateIn: Date,
    dateOut: Date,
    qtyIn: Number,
    deviceDescription: String,
    serialNumber: String,

    // Work Access
    workArea: String,
    typeOfWork: String,
    accessRefNumber: String,
    authorization: [String], // multiple authorizers
    keyCollection: String,
    apoOnDeskName: String,

    // Time tracking
    timeIn: {
      type: Date,
      default: Date.now,
    },
    timeOut: Date,

    signIn: String,
    signOut: String,

    remarks: String,

    // Status control
    status: {
      type: String,
      enum: ["Inside", "Out"],
      default: "Inside",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model("Log", logSchema);