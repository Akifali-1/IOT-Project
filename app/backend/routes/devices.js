const express = require('express');
const router = express.Router();
const Device = require('../models/device');

// GET all devices for a specific room
router.get('/:room', async (req, res) => {
    const { room } = req.params;
    try {
        const devices = await Device.find({ room });
        res.json(devices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching devices', error: error.message });
    }
});

// POST to add a new device
router.post('/', async (req, res) => {
    const { name, status, room } = req.body;
    try {
        const existingDevice = await Device.findOne({ name, room });

        if (existingDevice) {
            return res.status(400).json({ message: 'Device already exists in this room' });
        }

        const newDevice = new Device({ name, status, room, lastUpdated: new Date() });
        await newDevice.save();
        res.status(201).json({ message: 'Device added successfully', device: newDevice });
    } catch (error) {
        res.status(500).json({ message: 'Error adding device', error: error.message });
    }
});

// PUT to update device status and log usage
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updatedDevice = await Device.findByIdAndUpdate(
            id,
            { status, lastUpdated: new Date() },
            { new: true }
        );
        
        if (!updatedDevice) {
            return res.status(404).json({ message: 'Device not found' });
        }

        // Get DeviceUsage from app locals
        const DeviceUsage = req.app.locals.DeviceUsage;
        if (!DeviceUsage) {
            return res.status(500).json({ message: 'Database not initialized' });
        }

        // Log the device usage
        const activeLog = await DeviceUsage.findOne({
            deviceName: updatedDevice.name,
            room: updatedDevice.room,
            status: 'on',
            endTime: null,
        });

        if (status === 'on') {
            // If turning ON, create a new usage log
            const newUsage = new DeviceUsage({
                deviceName: updatedDevice.name,
                room: updatedDevice.room,
                startTime: new Date(),
                status: 'on',
            });
            await newUsage.save();
        } else if (status === 'off' && activeLog) {
            // If turning OFF, update the last usage log
            activeLog.endTime = new Date();
            activeLog.status = 'off';
            await activeLog.save();
        }

        res.json({ message: 'Device status updated', device: updatedDevice });
    } catch (error) {
        res.status(500).json({ message: 'Error updating device', error: error.message });
    }
});

// DELETE to remove a device
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedDevice = await Device.findByIdAndDelete(id);
        if (!deletedDevice) {
            return res.status(404).json({ message: 'Device not found' });
        }
        res.json({ message: 'Device removed', device: deletedDevice });
    } catch (error) {
        res.status(500).json({ message: 'Error removing device', error: error.message });
    }
});

// POST to toggle device status
router.post('/toggleDevice', async (req, res) => {
    const { deviceName, room, status } = req.body;

    try {
        // Get DeviceUsage from app locals
        const DeviceUsage = req.app.locals.DeviceUsage;
        if (!DeviceUsage) {
            return res.status(500).json({ message: 'Database not initialized' });
        }

        // Log the device usage
        const activeLog = await DeviceUsage.findOne({
            deviceName: deviceName,
            room: room,
            status: 'on',
            endTime: null,
        });

        if (status === 'on') {
            // If turning ON, create a new usage log
            const newUsage = new DeviceUsage({
                deviceName: deviceName,
                room: room,
                startTime: new Date(),
                status: 'on',
            });
            await newUsage.save();
        } else if (status === 'off' && activeLog) {
            // If turning OFF, update the last usage log
            activeLog.endTime = new Date();
            activeLog.status = 'off';
            await activeLog.save();
        }

        res.json({ message: 'Device usage logged successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging device usage', error: error.message });
    }
});

module.exports = router;
