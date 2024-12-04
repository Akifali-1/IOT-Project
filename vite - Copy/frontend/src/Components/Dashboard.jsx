import React, { useState, useEffect } from 'react';
import Bottom from '../Components/bottom.jsx';
import Room from '../Components/Room.jsx';
import Bedroom from '../Components/Bedroom.jsx';
import LivingRoom from '../Components/LivingRoom.jsx';
import Kitchen from '../Components/Kitchen.jsx';
import Outdoor from '../Components/Outdoor.jsx';
import ACControl from '../Components/ACControl.jsx';
import Temp from '../Components/temp.jsx';
import FanControl from './Fan_Control.jsx';
import LightControl from './LightControl.jsx';
import LeftSection from './leftPC.jsx';
import './Dashboard.css';
import { initializeWebSocket, subscribeToMessages, sendMessage } from './websocketUtils';
import Left from './leftMOBILE.jsx';

const Dashboard = () => {
  const [selectedRoom, setSelectedRoom] = useState('LivingRoom');
  const [userName, setUserName] = useState('');
  const [ws, setWs] = useState(null);
  const [acStatus, setAcStatus] = useState({
    LivingRoom: false,
    Bedroom: false,
    Kitchen: false,
  });
  const [temperature, setTemperature] = useState({
    LivingRoom: 16,
    Bedroom: 20,
    Kitchen: 18,
  });

  const roomMapping = {
    LivingRoom: 'livingroom',
    Bedroom: 'bedroom',
    Kitchen: 'kitchen',
  };

  useEffect(() => {
    const storedUserName = localStorage.getItem('username');
    if (storedUserName) {
      setUserName(storedUserName);
    }

    const initialAcStatus = {
      LivingRoom: localStorage.getItem('LivingRoomAcStatus') === 'on',
      Bedroom: localStorage.getItem('BedroomAcStatus') === 'on',
      Kitchen: localStorage.getItem('KitchenAcStatus') === 'on',
    };
    setAcStatus(initialAcStatus);

    const socket = initializeWebSocket();
    subscribeToMessages(({ device, status, room }) => {
      const formattedRoom = Object.keys(roomMapping).find(
        (key) => roomMapping[key] === room
      );
      if (device === 'ac' && formattedRoom) {
        setAcStatus((prevStatus) => ({
          ...prevStatus,
          [formattedRoom]: status === 'on',
        }));
        localStorage.setItem(`${formattedRoom}AcStatus`, status);
      }
    });
  }, []);

  useEffect(() => {
    const storedTemps = JSON.parse(localStorage.getItem('roomTemperatures'));
    if (storedTemps) {
      setTemperature(storedTemps);
    }
  }, []);

  const toggleAC = () => {
    const newStatus = !acStatus[selectedRoom];
    setAcStatus((prevStatus) => ({
      ...prevStatus,
      [selectedRoom]: newStatus,
    }));
    localStorage.setItem(`${selectedRoom}AcStatus`, newStatus ? 'on' : 'off');
    sendMessage({ device: 'ac', status: newStatus ? 'on' : 'off', room: roomMapping[selectedRoom] });
  };

  const increaseTemperature = () => {
    setTemperature((prevTemp) => {
      const newTemp = Math.min(prevTemp[selectedRoom] + 1, 30);
      const updatedTemps = { ...prevTemp, [selectedRoom]: newTemp };
      localStorage.setItem('roomTemperatures', JSON.stringify(updatedTemps));

      // Send updated temperature along with the AC's current status
      sendMessage({
        device: 'ac',
        status: acStatus[selectedRoom] ? 'on' : 'off',
        temperature: '+',
        room: roomMapping[selectedRoom],
      });

      return updatedTemps;
    });
  };

  const decreaseTemperature = () => {
    setTemperature((prevTemp) => {
      const newTemp = Math.max(prevTemp[selectedRoom] - 1, 16);
      const updatedTemps = { ...prevTemp, [selectedRoom]: newTemp };
      localStorage.setItem('roomTemperatures', JSON.stringify(updatedTemps));

      // Send updated temperature along with the AC's current status
      sendMessage({
        device: 'ac',
        status: acStatus[selectedRoom] ? 'on' : 'off',
        temperature: '-',
        room: roomMapping[selectedRoom],
      });

      return updatedTemps;
    });
  };
  const renderRoom = () => {
    switch (selectedRoom) {
      case 'LivingRoom':
        return <LivingRoom ws={ws} isAcOn={acStatus.LivingRoom} toggleAC={toggleAC} />;
      case 'Kitchen':
        return <Kitchen ws={ws} isAcOn={acStatus.Kitchen} toggleAC={toggleAC} />;
      case 'Bedroom':
        return <Bedroom ws={ws} isAcOn={acStatus.Bedroom} toggleAC={toggleAC} />;
      case 'Outdoor':
        return <Outdoor />;
      default:
        return <LivingRoom ws={ws} isAcOn={acStatus.LivingRoom} toggleAC={toggleAC} />;
    }
  };

  const setInitialTemperature = () => {
    const userInput = prompt(
      `Enter initial temperature for ${selectedRoom} (16-30°C):`
    );
    const newTemp = parseInt(userInput, 10);
    if (newTemp >= 16 && newTemp <= 30) {
      setTemperature((prevTemp) => {
        const updatedTemps = { ...prevTemp, [selectedRoom]: newTemp };
        localStorage.setItem(
          'roomTemperatures',
          JSON.stringify(updatedTemps)
        );
        return updatedTemps;
      });
    } else {
      alert('Invalid temperature. Please enter a value between 16 and 30.');
    }
  };

  return (
    <div className="flex max-h-screen">
      <style>
        {`
          .hide-scrollbar {
            overflow-y: auto;
            scrollbar-width: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      
      <LeftSection
        userName={userName}
        selectedRoom={selectedRoom}
        acStatus={acStatus}
        toggleAC={toggleAC}
        temperature={temperature}
        increaseTemperature={increaseTemperature}
        decreaseTemperature={decreaseTemperature}
        setInitialTemperature={setInitialTemperature}
      /> 
      <div className="radial w-[100%] dark:!bg-[#0e193c] flex flex-col sm:w-screen lg:w-[32vw] bg-white h-[100%] lg:h-screen fixed lg:relative p-3 ml-auto  ">
        <div className="lg:hidden mt-12  z-0">
          <h1 className="text-[24px] ml-3 font-light dark:text-slate-400 text-gray-800 mt-3 sm:text-[19px]">
            Hey, <span className="font-bold">{userName || 'User'} 👋🏻</span> Welcome to Dashboard
          </h1>
          <Temp />
        </div>
        <Room onSelectedRoom={setSelectedRoom} />
        <div
          className="flex-grow borderhuna w-full mx-auto rounded-lg sm:p-2 p-4 hide-scrollbar sm:max-h-0"
          style={{ maxHeight: '100vh' }}
        >
          {renderRoom()}
        </div>
        <div className="sm:hidden md:hidden tb:hidden lg:w-full lg:mx-auto lg:flex lg:justify-center lg:mt-3">
          <Temp />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
