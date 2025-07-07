# 🌐 IoT-Based Home Automation System

The IoT Home Automation project is designed to control home appliances using voice commands and real-time device management. It operates with an **ESP32 microcontroller**, **WebSocket communication**, and a custom-built website for seamless control.

---

## ✨ Features
- 🎤 **Voice-Controlled Automation**: Turn appliances on/off using voice commands.
- ⚡ **Real-Time Control**: Control fan and light instantly via WebSocket.
- 🌐 **Web Dashboard**: Control and monitor devices from a custom website.

---

## 🛠️ Technologies Used
- ESP32 Microcontroller
- WebSocket Communication
- React.js for Website Dashboard
- JavaScript / HTML / CSS

---

## 📱 Key Functionalities
- 🎤 Voice recognition to control devices
- 💡 Real-time fan and light control via WebSocket
- 🌐 Website for device status and manual control

---

## 🚀 How to Run


### Clone the repository
```bash
git clone https://github.com/Akifali-1/IoT-Home-Automation-Project.git
``` 
### Navigate to the project directory
```bash
cd IOT-Project/app/frontend
```
# Install frontend dependencies
```bash
npm install
```
### Navigate to backend directory
```bash
cd ../backend
```

### Install backend dependencies
```bash
npm install
```
### Navigate back to main app directory
```bash
cd ..
```
## ▶️ Run the Project
### Run Frontend (Terminal 1)
```bash
cd IOT-Project/app/frontend
npm run dev
```
### Run Backend (Terminal 2)
```bash
cd IOT-Project/app/backend
node app.js
```

## 🔧 Future Improvements
🎤 Integrate offline voice-to-text using Whisper.cpp or similar.

📱 Mobile app support for remote control.

🌐 Deploy backend and frontend on a local server or cloud.

🔒 Add user authentication for website access.

## ✅ Important Notes
Ensure ESP32 is connected and programmed with the correct firmware.

Make sure WebSocket server is running before starting the ESP32.
