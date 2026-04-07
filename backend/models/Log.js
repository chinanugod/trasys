const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["Movement", "Vehicle", "Device", "WorkAccess", "CarParkBeat"],
    },

    sn: {
      type: Number,
      default: () => Math.floor(Math.random() * 1000000), // Random 6-digit number
      required: true,
    },

    // ===== MOVEMENT (Visitors / Contractors) =====
    name: String,
    phone: String,
    companyName: String,
    purpose: String,

    // ===== VEHICLE =====
    plateNumber: String,
    vehicleMake: String,
    driverName: String,
    driverPhone: String,
    vehicleAuthorization: [String], // multiple staff
    gatePassNumber: String,
    cargoDescription: String,
    apoOnDeskName: String,
    numberOfPassengers: Number,

    // ===== DEVICE =====
    deviceDescription: String,
    serialNumber: String,
    qtyIn: Number,
    qtyOut: Number,

    // ===== WORK ACCESS =====
    workArea: String,
    typeOfWork: String,
    accessRefNumber: String,
    workAuthorization: [String], // multiple staff
    contactPerson: String,
    apoOnDeskName: String,

    // ===== CAR PARK BEAT =====
    vehicleColor: String,
    remarks: String,

    // ===== TIME TRACKING =====
    timeIn: {
      type: Date,
      default: Date.now,
    },
    timeOut: Date,

    // ===== STATUS =====
    status: {
      type: String,
      enum: ["Inside", "Out"],
      default: "Inside",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Log", logSchema);