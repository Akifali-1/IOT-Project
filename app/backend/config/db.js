const mongoose = require('mongoose');

const connectUserDB = async () => {
    try {
        const mongoUserURI = process.env.MONGO_USER_URI;

        if (mongoose.connection.readyState === 0) {
            // Connect if not already connected
            await mongoose.connect(mongoUserURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
            console.log('UserDB connected');
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

        // Create a new connection for the devices database
        const devicesConnection = mongoose.createConnection(mongoDeviceURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        devicesConnection.on('connected', () => {
            console.log('DevicesDB connected');
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
