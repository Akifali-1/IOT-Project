const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const WebSocket = require('ws');
const Device = require('./models/device'); // Import the Device model

// Wrap everything in a function to initialize WebSocket and Express app
function initializeWebSocket() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // HTTP server setup
  const server = app.listen(5001, () => console.log('HTTP Server running on http://localhost:5001'));

  // WebSocket setup
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    //console.log("Client connected");

    ws.on('message', async (message) => {
      try {
        const { device, status, room } = JSON.parse(message);

        // Update MongoDB using the device, status, and room fields
        const updatedDevice = await Device.findOneAndUpdate(
          { name: device, room },
          { status, timestamp: new Date() },
          { upsert: true, new: true }
        );

        // Broadcast the updated device status and room to all WebSocket clients
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ device, status, room }));
          }
        });

        // console.log(`Updated device: ${device} in room: ${room} to status: ${status}`);
      } catch (error) {
        // console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({ error: 'Error updating device status' }));
      }
    });

    ws.on('close', () => {
      //console.log('WebSocket connection closed');
    });
  });

  // REST API to get device status for a specific device and room
  app.get('/status', async (req, res) => {
    const { device, room } = req.query;

    try {
      const deviceStatus = await Device.findOne({ name: device, room });
      if (deviceStatus) {
        res.json(deviceStatus);
      } else {
        res.status(404).json({ message: 'Device not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching device status' });
    }
  });
}

// Export the function
module.exports = initializeWebSocket;
