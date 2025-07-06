🏠 IoT Home Automation System
IoT Home Automation System is a project that enables voice-controlled operation of household devices using an ESP32 microcontroller. It features automatic device shutdown based on room occupancy using a robo ball sensor and real-time communication using WebSocket.

🚀 Features
🎙️ Voice-Controlled Devices: Control lights and fans via voice commands.

🤖 Occupancy Detection: Robo ball sensor detects room presence.

🔌 Automatic Power Saving: Devices automatically turn off when the room is unoccupied.

🔗 Real-Time Communication: WebSocket-based instant updates between ESP32 and the dashboard.

🛠️ Technologies Used
ESP32 Microcontroller

Edge Impulse (ML model training)

WebSocket

Arduino

Vite (Frontend)

Node.js (Backend)

📱 Key Functionalities
🗣️ Voice-controlled fan and light operation

🕹️ Real-time device control via WebSocket

🛑 Automatic device shutdown when the room is empty

🤖 Robo ball-based occupancy detection

💻 How to Run
📥 Clone the repository:
bash
Copy
Edit
git clone https://github.com/your-username/iot-home-automation.git
📂 Navigate to:
bash
Copy
Edit
cd iot-home-automation/app
💻 Open Split Terminals
👉 In Terminal 1 (Frontend)
bash
Copy
Edit
npm install
npm run dev
👉 In Terminal 2 (Backend)
bash
Copy
Edit
node app.js
⚙️ Configure
Set WiFi credentials and WebSocket server address in the ESP32 code.

Ensure the Edge Impulse model is deployed correctly to ESP32.

Both frontend and backend should run simultaneously for real-time updates.

📚 Future Improvements
📲 Add mobile app control

🗣️ Expand voice control to multiple devices

⚡ Implement advanced energy monitoring

🌐 Improve the web dashboard interface

✅ Important Notes:

ESP32 must be connected to a stable WiFi network.

Backend server should run continuously to maintain WebSocket connection.
