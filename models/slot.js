

module.exports = mongoose.model("Slot", SlotSchema);
const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true // e.g., "A1", "B2"
  },
  x: {
    type: Number,
    required: true // grid position (for route/pathfinding)
  },
  y: {
    type: Number,
    required: true
  },
  occupied: {
    type: Boolean,
    default: false // true when vehicle is parked
  },
  floor: {
    type: Number,
    default: 0 // useful for multi-floor parking
  },
  easeScore: {
    type: Number,
    default: 0 // larger = farther (or smaller = nearer)
  },
  routeSteps: {
    type: [String],
    default: [] // e.g., ["straight", "right", "park"]
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Automatically update `lastUpdated` on save
SlotSchema.pre('save', function (next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('Slot', SlotSchema);