🏠 IoT Home Automation System
IoT Home Automation System is a project that enables voice-controlled operation of household devices using an ESP32 microcontroller. It also features automatic device shutdown based on room occupancy using a robo ball sensor. The system provides real-time communication through WebSocket and uses Edge Impulse for machine learning model training.


🛠️ Technologies Used
ESP32 Microcontroller

Edge Impulse (for ML model training)

WebSocket (for real-time communication)

Arduino

Vite (Frontend)

Node.js (Backend)

📱 Key Functionalities
🗣️ Voice-controlled fan and light operation

🕹️ Real-time device control via WebSocket



🚀 How to Run
📥 Clone the repository:
bash
Copy
Edit
git clone https://github.com/your-username/iot-home-automation.git
📂 Navigate to the project folder:
bash
Copy
Edit
cd iot-home-automation/app
💻 Open Split Terminals
👉 Terminal 1 (Frontend)
bash
Copy
Edit
npm install
npm run dev
(This will start the Vite frontend server.)

👉 Terminal 2 (Backend)
bash
Copy
Edit
node app.js
(This will start the backend server.)

⚙️ Configure:
Make sure WiFi credentials and WebSocket server address are correctly set in the ESP32 code.

Ensure the Edge Impulse model is deployed properly to ESP32.

The frontend and backend must run simultaneously for real-time updates.

🔧 Future Improvements
📲 Add mobile app control

🗣️ Expand voice control to more devices

⚡ Implement advanced energy monitoring

🌐 Improve UI for web dashboard

✅ Important Notes:

ESP32 should be connected to a stable WiFi network.

The backend server should be running continuously to handle real-time WebSocket communication.

