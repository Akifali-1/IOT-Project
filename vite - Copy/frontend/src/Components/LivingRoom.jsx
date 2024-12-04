import React, { useEffect, useState } from 'react';
import { fetchDevices, toggleDevice, addDevice, removeDevice } from './deviceUtils';
import { initializeWebSocket, subscribeToMessages } from './websocketUtils';
import fan from '../assets/fan-tan.png'

import light from '../assets/idea.png'
import heater from '../assets/heater.png'
import ac from '../assets/air-conditioner.png'
import tv from '../assets/tv.png'
import './rooms.css'
import './utility.css'


function LivingRoom() {
    const [devices, setDevices] = useState([]);
    const [deviceStates, setDeviceStates] = useState({});
    const [newDevice, setNewDevice] = useState('');
    const allowedDevices = ['fan', 'light', 'ac', 'heater', 'Television'];

    const deviceImages = {
        fan: fan,
        light: light,
        ac: ac,
        heater: heater,
        television: tv,
    };


    const isGuest = window.location.pathname.includes('/guest');

    useEffect(() => {
        fetchDevices(setDevices, setDeviceStates, 'livingroom');

        const socket = initializeWebSocket();

        subscribeToMessages(({ device, status, room }) => {
            if (room === 'livingroom') {
                setDeviceStates((prevStates) => ({
                    ...prevStates,
                    [device]: status === 'on',
                }));
            }
        });
    }, []);

    return (
        <div className="room lg:px-6  items-center h-screen sm:-mt-6 sm:-ml-2">
            <h2 className="text-2xl font-bold mb-4 sm:!mb-4 sm:text-[22px]">Living Room</h2>
            {!isGuest && (
                <div className="mb-4 flex">
                    <input
                        type="text"
                        value={newDevice}
                        onChange={(e) => setNewDevice(e.target.value)}
                        placeholder="Add new device"
                        className="border p-2 rounded mr-2 bg-[#e9efff] text-black"
                    />
                    <button
                        onClick={() =>
                            addDevice(
                                newDevice,
                                allowedDevices,
                                devices,
                                setDevices,
                                setDeviceStates,
                                setNewDevice,
                                isGuest,
                                'livingroom'
                            )
                        }
                        className="bg-blue-500 dark:bg-opacity-15 text-white py-2 px-7 rounded sm:p-[10px]"
                    >
                        <div className=" flex gap-x-2 sm:gap-x-1">    <svg className='size-6 invert' width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                            <circle opacity="0.5" cx="12" cy="12" r="10" stroke="#1C274C" strokeWidth="1.5" />
                            <path
                                d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15"
                                stroke="#1C274C"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </svg> Device</div>
                    </button>
                </div>
            )}
            <div className="grid grid-cols-1 gap-2 lg:w-full max-w-lg sm:max-w-[700px]">
                {devices.length > 0 ? (
                    devices.map((device) => (
                        <div
                            key={device._id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                backgroundColor: deviceStates[device.name] ? '#527ff4' : '#d0d7e0',
                        
                                padding: '12px 15px',
                                borderRadius: '12px',
                                width: '95%',
                                height: '65px',
                                marginBottom: '16px',
                                transition: 'background-color 0.3s ease',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className='bg-[#ffffff43] rounded-[20000px]  mr-4 p-[5px] -pr-5'>
                                    <img className='  w-5 invert '
                                        src={deviceImages[device.name] || 'path-to-default-image.png'}
                                        alt={`${device.name} icon`}
                                        style={{
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',


                                        }}
                                    /></div>
                                <h3 style={{ margin: '0', fontSize: '1.2rem', color: 'white' }}>
                                    {device.name.charAt(0).toUpperCase() + device.name.slice(1)}
                                </h3>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div
                                    onClick={() => toggleDevice(device, deviceStates, setDeviceStates, 'livingroom')}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        backgroundColor: deviceStates[device.name] ? '#3863ee' : '#b0bec5',
                                        padding: '5px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.3s ease',
                                        width: '70px',
                                        height: '38px',
                                        position: 'relative',
                                        marginRight: '8px',
                                    }}
                                >
                                    <span
                                        style={{
                                            position: 'absolute',
                                            left: deviceStates[device.name] ? '10px' : '38px',
                                            color: deviceStates[device.name] ? 'white' : '#4b82f1',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            transition: 'left 0.3s, color 0.3s',
                                        }}
                                    >
                                        {deviceStates[device.name] ? 'ON' : 'OFF'}
                                    </span>
                                    <div
                                        style={{
                                            height: '33px',
                                            width: '28px',
                                            backgroundColor: 'white',
                                            borderRadius: '6px',
                                            transition: 'transform 0.3s ease',
                                            transform: deviceStates[device.name] ? 'translateX(38px)' : 'translateX(0)',
                                        }}
                                    ></div>
                                </div>
                                {!isGuest && (
                                    <button
                                        onClick={() => removeDevice(device, setDevices, setDeviceStates, isGuest)}
                                        style={{
                                            fontSize: '1.2rem',
                                            color: '#f44336',
                                            border: 'none',
                                            background: 'none',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        x
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No devices available in the Living Room.</p>
                )}
            </div>
        </div>
    );
}

export default LivingRoom;
