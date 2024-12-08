import React, { useState } from 'react';
import { FaLightbulb, FaFan, FaFireAlt, FaSnowflake, FaTv, FaWarehouse, FaTemperatureHigh, FaVolumeUp, FaCamera } from 'react-icons/fa'; // Import icons

function Device() {
    const allowedRooms = ['bedroom', 'kitchen', 'living room', 'livingroom', 'outdoor'];
    const [deviceName, setDeviceName] = useState('');

    const handleAddDevice = async (deviceType) => {
        const selectedRoom = prompt(`Enter the room name to add the ${deviceType} (e.g., 'Living Room', 'Bedroom', 'Kitchen'):`);
        if (!selectedRoom) return; // Handle empty prompt

        const normalizedRoom = selectedRoom.trim().toLowerCase();
        if (!allowedRooms.includes(normalizedRoom)) {
            alert('Invalid room name. Please enter a valid room: Bedroom, Kitchen, Living Room, Outdoor.');
            return;
        }

        const deviceSynonyms = {
            ac: "ac",
            'air conditioner': "ac",
        
            airconditioner: "ac",
            fridge: "fridge",
            refrigerator: "fridge",
            tv: "television",
            television: "television",
            speaker: "speaker",
            fan: "fan",
            light: "light",
            heater: "heater",
        };
        const normalizedDevice = deviceSynonyms[deviceType.trim().toLowerCase()]
        try {
            const response = await fetch('http://localhost:8080/api/devices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: normalizedDevice, status: 'off', room: normalizedRoom }),
            });

            if (response.ok) {
                alert(`${deviceType} successfully added to ${selectedRoom}`);
            } else {
                const result = await response.json();
                alert(result.message || 'Failed to add device.');
            }
        } catch (error) {
            console.error('Error adding device:', error);
            alert('An error occurred while adding the device.');
        }
    };

    // Define the devices with their corresponding icons and colors
    const devices = [
        { name: 'Light', icon: <FaLightbulb color="#FFD700" size="2em" /> },
        { name: 'Fan', icon: <FaFan color="#1E90FF" size="2em" /> },
        { name: 'Heater', icon: <FaFireAlt color="#FF4500" size="2em" /> },
        { name: 'Air Conditioner', icon: <FaSnowflake color="#00BFFF" size="2em" /> },
        { name: 'Refrigerator', icon: <FaWarehouse color="#8A2BE2" size="2em" /> },
        { name: 'Television', icon: <FaTv color="#32CD32" size="2em" /> },
        { name: 'Speaker', icon: <FaVolumeUp color="#FF6347" size="2em" /> },
        { name: 'Camera', icon: <FaCamera color="#FF69B4" size="2em" /> },
        { name: 'Thermostat', icon: <FaTemperatureHigh color="#FF8C00" size="2em" /> },
        {
            name: 'Washing Machine',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 64 64"
                    width="2em"
                    height="2em"
                >
                    <rect x="10" y="8" width="44" height="48" rx="4" ry="4" fill="#00CED1" stroke="#008B8B" strokeWidth="2" />
                    <rect x="12" y="10" width="40" height="8" fill="#008B8B" />
                    <circle cx="18" cy="14" r="2" fill="#FFFFFF" />
                    <circle cx="24" cy="14" r="2" fill="#FFFFFF" />
                    <circle cx="30" cy="14" r="2" fill="#FFFFFF" />
                    <circle cx="32" cy="34" r="14" fill="#FFFFFF" stroke="#008B8B" strokeWidth="2" />
                    <circle cx="32" cy="34" r="8" fill="#00CED1" stroke="#008B8B" strokeWidth="1" />
                    <circle cx="32" cy="34" r="2" fill="#FFFFFF" />
                </svg>
            ),
        },
    ];

    return (
        <div className="lg:ml-14 md:ml-14 p-6 min-h-screen">
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6 text-center">Add Devices</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {devices.map((device, index) => (
                    <div key={index} className="bg-white p-4 shadow-md rounded text-center">
                        <div className="flex justify-center mb-2 opacity-80">{device.icon}</div>
                        <h2 className="font-semibold text-lg mb-2">{device.name}</h2>
                        <button
                            onClick={() => handleAddDevice(device.name)}
                            className="text-blue-500 hover:underline"
                        >
                            + Add Device
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Device;
