const mongoose = require('mongoose');

// Define the Device schema
const deviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ['fan', 'light', 'ac', 'heater','television','fridge','speaker'], // Only allowed devices
    },
    status: {
        type: String,
        enum: ['on', 'off'],
        required: true,
    },
    room: {
        type: String,
        required: true,
        enum: ['bedroom', 'kitchen', 'livingroom','outdoor'], // Add more rooms as needed
    },
    timestamp: {
        type: Date,
        default: Date.now,
    }
});

// Create a model for the schema
const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;
