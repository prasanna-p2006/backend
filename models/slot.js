const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
  id: String,
  x: Number,
  y: Number,
  occupied: { type: Boolean, default: false },
  easeScore: Number,
  routeSteps: [String],
});

module.exports = mongoose.model("Slot", SlotSchema);
