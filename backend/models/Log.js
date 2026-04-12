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
    directionDetail: String,
    cargoDescription: String,
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

    // ===== CHECK-IN / CHECK-OUT =====
    action: {
      type: String,
      enum: ["IN", "OUT"],
      required: true,
    },

    // ===== DIRECTION =====
    direction: {
      type: String,
      enum: ["From", "To"],
    },
  },

  // ==== TIMESTAMPS ===
  { timestamps: true }
);


module.exports = mongoose.model("Log", logSchema);