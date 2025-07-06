// dashboardFunctions.js
import { sendMessage, initializeWebSocket, subscribeToMessages } from './websocketUtils';

// Toggle AC state
export const toggleAC = (selectedRoom, acStatus, setAcStatus, roomMapping) => {
    const newStatus = !acStatus[selectedRoom];
    setAcStatus((prevStatus) => ({
        ...prevStatus,
        [selectedRoom]: newStatus,
    }));
    localStorage.setItem(`${selectedRoom}AcStatus`, newStatus ? 'on' : 'off');
    sendMessage({ device: 'ac', status: newStatus ? 'on' : 'off', room: roomMapping[selectedRoom] });
};

// Increase temperature by 1
export const increaseTemperature = (selectedRoom, temperature, setTemperature, acStatus, roomMapping) => {
    setTemperature((prevTemp) => {
        const newTemp = Math.min(prevTemp[selectedRoom] + 1, 30);
        const updatedTemps = { ...prevTemp, [selectedRoom]: newTemp };
        localStorage.setItem('roomTemperatures', JSON.stringify(updatedTemps));

        sendMessage({
            device: 'ac',
            status: acStatus[selectedRoom] ? 'on' : 'off',
            temperature: '+',
            room: roomMapping[selectedRoom],
        });

        return updatedTemps;
    });
};

// Decrease temperature by 1
export const decreaseTemperature = (selectedRoom, temperature, setTemperature, acStatus, roomMapping) => {
    setTemperature((prevTemp) => {
        const newTemp = Math.max(prevTemp[selectedRoom] - 1, 16);
        const updatedTemps = { ...prevTemp, [selectedRoom]: newTemp };
        localStorage.setItem('roomTemperatures', JSON.stringify(updatedTemps));

        sendMessage({
            device: 'ac',
            status: acStatus[selectedRoom] ? 'on' : 'off',
            temperature: '-',
            room: roomMapping[selectedRoom],
        });

        return updatedTemps;
    });
};

// Toggle fan state
export const toggleFan = (selectedRoom, fanStatus, setFanStatus, roomMapping) => {
    const newStatus = !fanStatus[selectedRoom];
    setFanStatus((prevStatus) => ({
        ...prevStatus,
        [selectedRoom]: newStatus,
    }));
    localStorage.setItem(`${selectedRoom}FanStatus`, newStatus ? 'on' : 'off');
    sendMessage({
        device: 'fan',
        status: newStatus ? 'on' : 'off',
        room: roomMapping[selectedRoom],
    });
};

// Increase fan speed
export const increaseFanSpeed = (selectedRoom, fanSpeed, setFanSpeed, fanStatus, roomMapping) => {
    setFanSpeed((prevSpeed) => {
        const newSpeed = Math.min(prevSpeed[selectedRoom] + 1, 5); // Max speed is 5
        const updatedSpeeds = { ...prevSpeed, [selectedRoom]: newSpeed };
        localStorage.setItem('roomFanSpeeds', JSON.stringify(updatedSpeeds));

        sendMessage({
            device: 'fan',
            status: fanStatus[selectedRoom] ? 'on' : 'off',
            speed: newSpeed,
            room: roomMapping[selectedRoom],
        });

        return updatedSpeeds;
    });
};

// Decrease fan speed
export const decreaseFanSpeed = (selectedRoom, fanSpeed, setFanSpeed, fanStatus, roomMapping) => {
    setFanSpeed((prevSpeed) => {
        const newSpeed = Math.max(prevSpeed[selectedRoom] - 1, 1); // Min speed is 1
        const updatedSpeeds = { ...prevSpeed, [selectedRoom]: newSpeed };
        localStorage.setItem('roomFanSpeeds', JSON.stringify(updatedSpeeds));

        sendMessage({
            device: 'fan',
            status: fanStatus[selectedRoom] ? 'on' : 'off',
            speed: newSpeed,
            room: roomMapping[selectedRoom],
        });

        return updatedSpeeds;
    });
};

// Fetch and initialize data for fan and AC states
export const initializeDevices = (setAcStatus, setFanStatus, setFanSpeed, roomMapping) => {
    const initialAcStatus = {
        LivingRoom: localStorage.getItem('LivingRoomAcStatus') === 'on',
        Bedroom: localStorage.getItem('BedroomAcStatus') === 'on',
        Kitchen: localStorage.getItem('KitchenAcStatus') === 'on',
    };
    setAcStatus(initialAcStatus);

    const initialFanStatus = {
        LivingRoom: localStorage.getItem('LivingRoomFanStatus') === 'on',
        Bedroom: localStorage.getItem('BedroomFanStatus') === 'on',
        Kitchen: localStorage.getItem('KitchenFanStatus') === 'on',
    };
    setFanStatus(initialFanStatus);

    const storedFanSpeeds = JSON.parse(localStorage.getItem('roomFanSpeeds'));
    if (storedFanSpeeds) {
        setFanSpeed(storedFanSpeeds);
    }

    const socket = initializeWebSocket();
    subscribeToMessages(({ device, status, speed, room }) => {
        const formattedRoom = Object.keys(roomMapping).find(
            (key) => roomMapping[key] === room
        );
        if (device === 'fan' && formattedRoom) {
            setFanStatus((prevStatus) => ({
                ...prevStatus,
                [formattedRoom]: status === 'on',
            }));
            localStorage.setItem(`${formattedRoom}FanStatus`, status);

            if (speed) {
                setFanSpeed((prevSpeed) => {
                    const updatedSpeeds = { ...prevSpeed, [formattedRoom]: speed };
                    localStorage.setItem('roomFanSpeeds', JSON.stringify(updatedSpeeds));
                    return updatedSpeeds;
                });
            }
        }
    });
};
export const initializeSocketAndHandlers = (roomMapping, setAcStatus, setFanStatus, setFanSpeed) => {
    // WebSocket initialization logic here

    // Example socket handling setup
    const socket = new WebSocket('ws://your-websocket-server-url');
    socket.onopen = () => {
        console.log('Connected to WebSocket');
    };

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        // Handle the incoming message
        if (message.type === 'AC_STATUS_UPDATE') {
            setAcStatus((prev) => ({ ...prev, [message.room]: message.status }));
        } else if (message.type === 'FAN_STATUS_UPDATE') {
            setFanStatus((prev) => ({ ...prev, [message.room]: message.status }));
        } else if (message.type === 'FAN_SPEED_UPDATE') {
            setFanSpeed((prev) => ({ ...prev, [message.room]: message.speed }));
        }
    };

    return socket;
};
