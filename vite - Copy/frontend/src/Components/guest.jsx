import React, { useState, useEffect } from 'react';
import Room from '../Components/Room.jsx';
import Bedroom from '../Components/Bedroom.jsx';
import LivingRoom from '../Components/LivingRoom.jsx';
import Kitchen from '../Components/Kitchen.jsx';
import Outdoor from '../Components/Outdoor.jsx';
import Temp from '../Components/temp.jsx';
import LeftSection from './leftPC.jsx';
import './Dashboard.css';
import { initializeWebSocket, subscribeToMessages, sendMessage } from './websocketUtils';


const Guest = () => {
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
    Outdoor:'outdoor'
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
      Outdoor: localStorage.getItem('OutdoorAcStatus') === 'on',
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

    
      sendMessage({
        device: 'ac',
        status: acStatus[selectedRoom] ? 'on' : 'off',
        temperature: '-',
        room: roomMapping[selectedRoom],
      });

      return updatedTemps;
    });
  };

  const [fanStatus, setFanStatus] = useState({
    LivingRoom: false,
    Bedroom: false,
    Kitchen: false,
  });
  const [fanSpeed, setFanSpeed] = useState({
    LivingRoom: 1,
    Bedroom: 1,
    Kitchen: 1,
  });

  useEffect(() => {
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
  }, []);


  const increaseFanSpeed = () => {
    setFanSpeed((prevSpeed) => {
      const newSpeed = Math.min(prevSpeed[selectedRoom] + 1, 5); // Max speed is 5
      const updatedSpeeds = { ...prevSpeed, [selectedRoom]: newSpeed };
      localStorage.setItem('roomFanSpeeds', JSON.stringify(updatedSpeeds));

      // Send updated speed along with the fan's current status
      sendMessage({
        device: 'fan',
        status: fanStatus[selectedRoom] ? 'on' : 'off',
        speed: newSpeed,
        room: roomMapping[selectedRoom],
      });

      return updatedSpeeds;
    });
  };

  const decreaseFanSpeed = () => {
    setFanSpeed((prevSpeed) => {
      const newSpeed = Math.max(prevSpeed[selectedRoom] - 1, 1); // Min speed is 1
      const updatedSpeeds = { ...prevSpeed, [selectedRoom]: newSpeed };
      localStorage.setItem('roomFanSpeeds', JSON.stringify(updatedSpeeds));

      // Send updated speed along with the fan's current status
      sendMessage({
        device: 'fan',
        status: fanStatus[selectedRoom] ? 'on' : 'off',
        speed: newSpeed,
        room: roomMapping[selectedRoom],
      });

      return updatedSpeeds;
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
        increaseFanSpeed={increaseFanSpeed}
        decreaseFanSpeed={decreaseFanSpeed}
        fanSpeed={fanSpeed}
      />
      <div className="radial w-[100%] dark:!bg-[#0e193c] flex flex-col sm:w-screen lg:w-[32vw] bg-white h-[100%] lg:h-screen fixed lg:relative p-3 ml-auto  ">
        <div className="lg:hidden mt-12  z-0">
          <h1 className="text-[24px] ml-3 font-light dark:!text-slate-400 text-gray-800 mt-3 sm:text-[19px]">
            Hey, <span className="font-bold"> Guest 👋🏻</span> Welcome to Dashboard
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

export default Guest;
