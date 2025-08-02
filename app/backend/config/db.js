const mongoose = require('mongoose');

const connectUserDB = async () => {
    try {
        const mongoUserURI = process.env.MONGO_USER_URI;
        
        console.log('Environment check - MONGO_USER_URI:', mongoUserURI ? 'SET' : 'NOT SET');
        
        if (!mongoUserURI) {
            console.error('MONGO_USER_URI environment variable is not set');
            console.error('Available environment variables:', Object.keys(process.env).filter(key => key.includes('MONGO')));
            throw new Error('MONGO_USER_URI environment variable is not set. Please check your Render environment variables.');
        }

        if (mongoose.connection.readyState === 0) {
            // Connect if not already connected
            console.log('Attempting to connect to UserDB...');
            await mongoose.connect(mongoUserURI, {
                serverSelectionTimeoutMS: 10000, // Increased timeout
                socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
            });
            console.log('UserDB connected successfully');
        } else {
            console.log('UserDB already connected');
        }
        return mongoose.connection; // Return the connection instance for further use
    } catch (err) {
        console.error('UserDB connection error:', err.message);
        console.error('Full error:', err);
        throw err; // Throw the error for handling at a higher level
    }
};

const connectDevicesDB = async () => {
    try {
        const mongoDeviceURI = process.env.MONGO_DEVICE_URI;
        
        console.log('Environment check - MONGO_DEVICE_URI:', mongoDeviceURI ? 'SET' : 'NOT SET');
        
        if (!mongoDeviceURI) {
            console.error('MONGO_DEVICE_URI environment variable is not set');
            console.error('Available environment variables:', Object.keys(process.env).filter(key => key.includes('MONGO')));
            throw new Error('MONGO_DEVICE_URI environment variable is not set. Please check your Render environment variables.');
        }

        // Create a new connection for the devices database
        console.log('Attempting to connect to DevicesDB...');
        const devicesConnection = mongoose.createConnection(mongoDeviceURI, {
        
            serverSelectionTimeoutMS: 10000, // Increased timeout
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });

        devicesConnection.on('connected', () => {
            console.log('DevicesDB connected successfully');
        });

        devicesConnection.on('error', (err) => {
            console.error('DevicesDB connection error:', err.message);
            console.error('Full error:', err);
        });

        return devicesConnection; // Return the connection instance
    } catch (err) {
        console.error('DevicesDB connection error:', err.message);
        console.error('Full error:', err);
        throw err; // Throw the error for handling at a higher level
    }
};

module.exports = { connectUserDB, connectDevicesDB };
