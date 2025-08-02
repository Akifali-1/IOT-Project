const mongoose = require('mongoose');

const deviceUsageSchema = new mongoose.Schema({
  deviceName: { type: String, required: true }, // e.g., Fan, AC
  room: { type: String, required: true },      // e.g., Bedroom, Kitchen
  startTime: { type: Date, required: true },   // When the device was turned ON
  endTime: { type: Date },                     // When the device was turned OFF
  status: { type: String, required: true },    // ON or OFF
});

// Export a function that creates the model with the correct connection
module.exports = (devicesConnection) => {
  return devicesConnection.model('DeviceUsage', deviceUsageSchema);
};
