const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: true,
    unique: true, // one active booking per vehicle
    trim: true
  },
  slotId: {
    type: String,
    required: true // ID of the slot booked (e.g., "S9")
  },
  bookedAt: {
    type: Date,
    default: Date.now // auto-sets when booked
  },
  leftAt: {
    type: Date,
    default: null // set when the user leaves
  }
});

// Automatically clear the vehicle number when the user leaves
UserSchema.methods.markLeft = async function() {
  this.leftAt = new Date();
  await this.save();
};

module.exports = mongoose.model('User', UserSchema);