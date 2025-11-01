const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  registrationNumber: { type: String, unique: true },
  slotId: { type: String, default: null },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date },
});

module.exports = mongoose.model("Vehicle", VehicleSchema);
