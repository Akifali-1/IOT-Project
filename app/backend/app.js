const dotenv = require('dotenv').config();
const express = require('express')
const http = require('http');
const { connectUserDB, connectDevicesDB } = require('./config/db');
const cors = require('cors');
const initializeWebSocket = require('./websocket.js');
const DeviceUsageSchema = require('./models/deviceUsage'); // Import the schema function
const mongoose = require('mongoose'); // Added for database connection status test

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;

// Initialize database connections
const initializeDB = async () => {
    try {
        await connectUserDB();
        const devicesConnection = await connectDevicesDB();
        
        // Create DeviceUsage model with the devices connection
        const DeviceUsage = DeviceUsageSchema(devicesConnection);
        
        console.log('All database connections established');
        
        // Make DeviceUsage available globally for routes
        app.locals.DeviceUsage = DeviceUsage;
        
        return { DeviceUsage };
    } catch (error) {
        console.error('Failed to connect to databases:', error.message);
        process.exit(1); // Exit if database connection fails
    }
};

// Initialize databases
initializeDB()
    .then(({ DeviceUsage: model }) => {
        // DeviceUsage is now available in app.locals.DeviceUsage
        console.log('Database initialization completed');
        initializeWebSocket(server, app);
        server.listen(PORT, '0.0.0.0', () => {
            console.log(`App listening on PORT:${PORT}`);
        });
    })
    .catch(error => {
        console.error('Database initialization failed:', error);
        process.exit(1);
    });

// CORS configuration - more flexible for deployment
const allowedOrigins = [
    'https://smarthome-peach.vercel.app',
    'https://iot-project-frontend.vercel.app',
    'https://iot-project-frontend-git-main.vercel.app',
    'https://iot-project-frontend-git-master.vercel.app',
    'https://iot-project-frontend-xmov.onrender.com',
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.FRONTEND_URL // Allow environment variable for frontend URL
].filter(Boolean); // Remove any undefined values

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Log the origin for debugging
        console.log('Request from origin:', origin);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json({ extended: false }));

// Test endpoint to check environment variables (remove in production)
app.get('/api/test/env', (req, res) => {
    const envVars = {
        MONGO_USER_URI: process.env.MONGO_USER_URI ? 'SET' : 'NOT SET',
        MONGO_DEVICE_URI: process.env.MONGO_DEVICE_URI ? 'SET' : 'NOT SET',
        JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
        PORT: process.env.PORT || '8080',
        NODE_ENV: process.env.NODE_ENV || 'development'
    };
    res.json(envVars);
});

// Test endpoint to check database connections
app.get('/api/test/db', async (req, res) => {
    try {
        const DeviceUsage = req.app.locals.DeviceUsage;
        if (!DeviceUsage) {
            return res.status(500).json({ 
                status: 'error', 
                message: 'DeviceUsage model not available - database not initialized' 
            });
        }

        // Test both databases
        const userConnection = mongoose.connection.readyState;
        const deviceConnection = DeviceUsage.db.db.admin().ping();

        res.json({
            status: 'success',
            userDB: userConnection === 1 ? 'connected' : 'disconnected',
            deviceDB: 'connected',
            message: 'Both databases are working'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Database test failed',
            error: error.message
        });
    }
});

// Test endpoint to check WebSocket server
app.get('/api/test/websocket', (req, res) => {
    res.json({
        status: 'success',
        message: 'WebSocket server is running on port 5001',
        websocketUrl: 'ws://localhost:5001'
    });
});

app.get('/api/devices/calculateUsage', async (req, res) => {
    try {
        const DeviceUsage = req.app.locals.DeviceUsage;
        if (!DeviceUsage) {
            return res.status(500).json({ message: 'Database not initialized' });
        }

        const usages = await DeviceUsage.find(); // Fetch usage records from the database   

        if (!usages.length) {
            return res.status(404).json({ message: 'No device usage records found' });
        }

        // Aggregate usage data by device and room
        const aggregatedData = usages.reduce((acc, usage) => {
            const startTime = new Date(usage.startTime);
            const endTime = usage.endTime ? new Date(usage.endTime) : new Date();
            const durationInMs = endTime - startTime;
            const durationInHours = durationInMs / (1000 * 60 * 60); // Convert to hours
            const duration = durationInHours < 0.01 ? 0.01 : durationInHours; // Minimum duration

            // Ensure valid device name and room
            const deviceName = usage.deviceName || "Unknown Device";
            const room = usage.room || "Unknown Room";
            const key = `${deviceName} (${room})`; // Key for grouping

            acc[key] = (acc[key] || 0) + duration; // Aggregate duration
            return acc;
        }, {});

        // Convert aggregated data into an array format for the frontend
        const usageData = Object.keys(aggregatedData).map((key) => ({
            deviceRoomName: key, // e.g., "Fan (Living Room)"
            duration: aggregatedData[key].toFixed(2), // Total time in hours
        }));

        // Calculate total bill
        const totalDuration = usageData.reduce((total, usage) => total + parseFloat(usage.duration), 0);
        const ratePerHour = 5; // Example rate per hour
        const totalBill = (totalDuration * ratePerHour).toFixed(2);

        return res.status(200).json({
            usageData,
            totalDuration: totalDuration.toFixed(2),
            totalBill,
        });
    } catch (error) {
        console.error('Error calculating usage:', error);
        return res.status(500).json({ message: 'Error calculating usage', error: error.message });
    }
});




app.get('/api/devices/weeklyUsage', async (req, res) => {
    try {
        const DeviceUsage = req.app.locals.DeviceUsage;
        if (!DeviceUsage) {
            return res.status(500).json({ message: 'Database not initialized' });
        }

        const usages = await DeviceUsage.find(); // Fetch usage records
        const dailyUsage = Array(7).fill(0); // Initialize usage for 7 days (Sunday to Saturday)

        usages.forEach((usage) => {
            const startTime = new Date(usage.startTime);
            const endTime = usage.endTime ? new Date(usage.endTime) : new Date();

            // Ensure valid times
            if (isNaN(startTime) || isNaN(endTime)) {
                console.warn(`Invalid times: ${usage.startTime} -> ${usage.endTime}`);
                return; // Skip invalid data
            }

            // Ensure endTime >= startTime
            if (endTime < startTime) {
                console.warn(`startTime is after endTime: ${startTime} -> ${endTime}`);
                return; // Skip invalid data
            }

            const durationInMs = endTime - startTime;
            const durationInHours = Math.max(durationInMs / (1000 * 60 * 60), 0.01); // Avoid zero usage

            let currentDay = startTime.getDay();
            let remainingDuration = durationInHours;

            while (remainingDuration > 0) {
                const startOfNextDay = new Date(startTime);
                startOfNextDay.setHours(24, 0, 0, 0); // Move to midnight of the next day

                const timeLeftToday = Math.min(
                    remainingDuration,
                    (startOfNextDay - startTime) / (1000 * 60 * 60)
                );

                dailyUsage[currentDay] += timeLeftToday;
                remainingDuration -= timeLeftToday;

                startTime.setHours(24, 0, 0, 0); // Advance startTime to next day
                currentDay = (currentDay + 1) % 7; // Wrap around to Sunday if needed
            }
        });

        // Align usage with the chart's starting day (Monday)
        const adjustedUsage = [...dailyUsage.slice(1), dailyUsage[0]];

        const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const weeklyUsage = adjustedUsage.map((usage, index) => ({
            day: DAYS_OF_WEEK[index],
            usage: usage.toFixed(2),
        }));

        return res.status(200).json(weeklyUsage);
    } catch (error) {
        console.error('Error calculating weekly usage:', error);
        return res.status(500).json({ message: 'Error calculating weekly usage', error: error.message });
    }
});



app.delete('/api/devices/clearUsage', async (req, res) => {
    try {
        const DeviceUsage = req.app.locals.DeviceUsage;
        if (!DeviceUsage) {
            return res.status(500).json({ message: 'Database not initialized' });
        }

        await DeviceUsage.deleteMany({}); // Adjust based on your database schema
        res.status(200).send({ message: 'All usage data cleared successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Failed to clear usage data.' });
    }
});




app.use('/api/auth', require('./routes/auth'));
app.use('/api/devices', require('./routes/devices'));

