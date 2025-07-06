const mongoose = require('mongoose');

const deviceUsageSchema = new mongoose.Schema({
  deviceName: { type: String, required: true }, // e.g., Fan, AC
  room: { type: String, required: true },      // e.g., Bedroom, Kitchen
  startTime: { type: Date, required: true },   // When the device was turned ON
  endTime: { type: Date },                     // When the device was turned OFF
  status: { type: String, required: true },    // ON or OFF
});

module.exports = mongoose.model('DeviceUsage', deviceUsageSchema);
