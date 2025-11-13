import { sendMessage } from "./websocketUtils";

// Fetch devices for a specific room
export const fetchDevices = async (setDevices, setDeviceStates, room) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/devices/${room}`);
        if (response.ok) {
            const data = await response.json();
            setDevices(data);

            // Initialize device states
            const initialStates = {};
            data.forEach((device) => {
                initialStates[device.name] = device.status === "on";
            });
            setDeviceStates(initialStates);
        } else {
            console.error("Failed to fetch devices. Status:", response.status);
        }
    } catch (error) {
        console.error("Error fetching devices:", error);
    }
};

// Toggle the state of a device
export const toggleDevice = async (device, deviceStates, setDeviceStates, room) => {
    const currentStatus = deviceStates[device.name];
    const newStatus = currentStatus ? "off" : "on";

    try {

        // Optimistically update state
        setDeviceStates((prevState) => ({
            ...prevState,
            [device.name]: !prevState[device.name],
        }));

        // Prepare WebSocket message ;

        const message = {
            device: device.name,
            status: newStatus,
            room,
        };
        sendMessage(message);

        // Update the device state in the backend
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/devices/${device._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
            console.error("Failed to toggle device");
            // Revert the UI state if the backend update fails
            setDeviceStates((prevState) => ({
                ...prevState,
                [device.name]: currentStatus,
            }));
        }
    } catch (error) {
        console.error("Error toggling device:", error);
        // Revert the UI state in case of error
        setDeviceStates((prevState) => ({
            ...prevState,
            [device.name]: currentStatus,
        }));
    }
};


// Add a new device to the room
// Synonym mapping for devices
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

export const addDevice = async (
    newDevice,
    allowedDevices,
    devices,
    setDevices,
    setDeviceStates,
    setNewDevice,
    isGuest,
    room
) => {
    if (isGuest) {
        console.log("Guest users cannot add devices.");
        return;
    }

    const normalizedNewDevice = deviceSynonyms[newDevice.trim().toLowerCase()] || newDevice.trim().toLowerCase();


    if (
        normalizedNewDevice &&
        allowedDevices.includes(normalizedNewDevice) &&
        !devices.some((d) => d.name === normalizedNewDevice)
    ) {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/devices`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: normalizedNewDevice, status: "off", room }),
            });
            if (response.ok) {
                const result = await response.json();
                setDevices((prevDevices) => [...prevDevices, result.device]);
                setDeviceStates((prevState) => ({
                    ...prevState,
                    [normalizedNewDevice]: false,
                }));
                setNewDevice("");
            } else {
                alert("Failed to add device.");
            }
        } catch (error) {
            console.error("Error adding device:", error);
        }
    } else {
        alert("Please enter a valid device or ensure it is not already added.");
    }
};


// Remove a device from the room
export const removeDevice = async (device, setDevices, setDeviceStates, isGuest) => {
    if (isGuest) {
        console.log("Guest users cannot remove devices.");
        return;
    }

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/devices/${device._id}`, {
            method: "DELETE",
        });
        if (response.ok) {
            setDevices((prevDevices) => prevDevices.filter((d) => d._id !== device._id));
            setDeviceStates((prevState) => {
                const newState = { ...prevState };
                delete newState[device.name];
                return newState;
            });
        } else {
            console.error("Failed to remove device. Status:", response.status);
        }
    } catch (error) {
        console.error("Error removing device:", error);
    }
};
