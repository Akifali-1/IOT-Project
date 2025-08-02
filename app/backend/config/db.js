const mongoose = require('mongoose');

const connectUserDB = async () => {
    try {
        const mongoUserURI = process.env.MONGO_USER_URI;
        
        if (!mongoUserURI) {
            throw new Error('MONGO_USER_URI environment variable is not set');
        }

        if (mongoose.connection.readyState === 0) {
            // Connect if not already connected
            await mongoose.connect(mongoUserURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
                socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
            });
            console.log('UserDB connected successfully');
        } else {
            console.log('UserDB already connected');
        }
        return mongoose.connection; // Return the connection instance for further use
    } catch (err) {
        console.error('UserDB connection error:', err.message);
        throw err; // Throw the error for handling at a higher level
    }
};

const connectDevicesDB = async () => {
    try {
        const mongoDeviceURI = process.env.MONGO_DEVICE_URI;
        
        if (!mongoDeviceURI) {
            throw new Error('MONGO_DEVICE_URI environment variable is not set');
        }

        // Create a new connection for the devices database
        const devicesConnection = mongoose.createConnection(mongoDeviceURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });

        devicesConnection.on('connected', () => {
            console.log('DevicesDB connected successfully');
        });

        devicesConnection.on('error', (err) => {
            console.error('DevicesDB connection error:', err.message);
        });

        return devicesConnection; // Return the connection instance
    } catch (err) {
        console.error('DevicesDB connection error:', err.message);
        throw err; // Throw the error for handling at a higher level
    }
};

module.exports = { connectUserDB, connectDevicesDB };
