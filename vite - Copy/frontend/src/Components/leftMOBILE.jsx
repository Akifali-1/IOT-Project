import React, { useState, useEffect } from 'react';
import Room from '../Components/Room.jsx';
import Bedroom from '../Components/Bedroom.jsx';
import LivingRoom from '../Components/LivingRoom.jsx';
import Kitchen from '../Components/Kitchen.jsx';
import Outdoor from '../Components/Outdoor.jsx';
import ACControl from '../Components/ACControl.jsx';
import FanControl from './Fan_Control.jsx';
import LightControl from './LightControl.jsx';
import './Dashboard.css';
import { initializeWebSocket, subscribeToMessages, sendMessage } from './websocketUtils';


const LeftMOBILE = () => {
  const [selectedRoom, setSelectedRoom] = useState('LivingRoom');
  const [userName, setUserName] = useState('');
  const [ws, setWs] = useState(null);
  const [acStatus, setAcStatus] = useState({
    LivingRoom: false,
    Bedroom: false,
    Kitchen: false,
    outdoor: false
  });
  const [temperature, setTemperature] = useState({
    LivingRoom: 16,
    Bedroom: 20,
    Kitchen: 18,
    outdoor: 16
  });

  const roomMapping = {
    LivingRoom: 'livingroom',
    Bedroom: 'bedroom',
    Kitchen: 'kitchen',
    Outdoor: 'outdoor'
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

  const [fanStatus, setFanStatus] = useState({
    LivingRoom: false,
    Bedroom: false,
    Kitchen: false,
    outdoor: false
  });
  const [fanSpeed, setFanSpeed] = useState({
    LivingRoom: 1,
    Bedroom: 1,
    Kitchen: 1,
    outdoor: 1
  });



  useEffect(() => {
    const initialFanStatus = {
      LivingRoom: localStorage.getItem('LivingRoomFanStatus') === 'on',
      Bedroom: localStorage.getItem('BedroomFanStatus') === 'on',
      Kitchen: localStorage.getItem('KitchenFanStatus') === 'on',
      Outdoor: localStorage.getItem('OutdoorFanStatus') === 'on',
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

  const [lightStatus, setLightStatus] = useState({
    LivingRoom: false,
    Bedroom: false,
    Kitchen: false,
    Outdoor: false,
  });

  const [lightBrightness, setLightBrightness] = useState({
    LivingRoom: 100,
    Bedroom: 100,
    Kitchen: 100,
    Outdoor: 100,
  });

  useEffect(() => {
    const initialLightStatus = {
      LivingRoom: localStorage.getItem('LivingRoomLightStatus') === 'on',
      Bedroom: localStorage.getItem('BedroomLightStatus') === 'on',
      Kitchen: localStorage.getItem('KitchenLightStatus') === 'on',
      Outdoor: localStorage.getItem('OutdoorLightStatus') === 'on',
    };
    setLightStatus(initialLightStatus);

    const storedBrightness = JSON.parse(localStorage.getItem('roomLightBrightness'));
    if (storedBrightness) {
      setLightBrightness(storedBrightness);
    }

    const socket = initializeWebSocket();
    subscribeToMessages(({ device, status, brightness, room }) => {
      const formattedRoom = Object.keys(roomMapping).find(
        (key) => roomMapping[key] === room
      );
      if (device === 'light' && formattedRoom) {
        setLightStatus((prevStatus) => ({
          ...prevStatus,
          [formattedRoom]: status === 'on',
        }));
        localStorage.setItem(`${formattedRoom}LightStatus`, status);

        if (brightness) {
          setLightBrightness((prevBrightness) => {
            const updatedBrightness = { ...prevBrightness, [formattedRoom]: brightness };
            localStorage.setItem('roomLightBrightness', JSON.stringify(updatedBrightness));
            return updatedBrightness;
          });
        }
      }
    });
  }, []);

  const increaseLightBrightness = () => {
    setLightBrightness((prevBrightness) => {
      const newBrightness = Math.min(prevBrightness[selectedRoom] + 50, 100); // Max is 100%
      const updatedBrightness = { ...prevBrightness, [selectedRoom]: newBrightness };
      localStorage.setItem('roomLightBrightness', JSON.stringify(updatedBrightness));

      // Send updated brightness along with the light's current status
      sendMessage({
        device: 'light',
        status: lightStatus[selectedRoom] ? 'on' : 'off',
        brightness: 'bright',
        room: roomMapping[selectedRoom],
      });

      return updatedBrightness;
    });
  };

  const decreaseLightBrightness = () => {
    setLightBrightness((prevBrightness) => {
      const newBrightness = Math.max(prevBrightness[selectedRoom] - 50, 50); // Min is 50%
      const updatedBrightness = { ...prevBrightness, [selectedRoom]: newBrightness };
      localStorage.setItem('roomLightBrightness', JSON.stringify(updatedBrightness));

      // Send updated brightness along with the light's current status
      sendMessage({
        device: 'light',
        status: lightStatus[selectedRoom] ? 'on' : 'off',
        brightness: 'dim',
        room: roomMapping[selectedRoom],
      });

      return updatedBrightness;
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
    const userInput = prompt(`
      Enter initial temperature for ${selectedRoom} (16-30°C):
    `);
    const newTemp = parseInt(userInput, 10);
    if (newTemp >= 16 && newTemp <= 30) {
      setTemperature((prevTemp) => {
        const updatedTemps = { ...prevTemp, [selectedRoom]: newTemp };
        localStorage.setItem('roomTemperatures', JSON.stringify(updatedTemps));
        return updatedTemps;
      });
    } else {
      alert('Invalid temperature. Please enter a value between 16 and 30.');
    }
  };

  return (
    <div className="mt-[55px] min-h-full ">
      <div className="bg-white z-10 w-full fixed pl-5  dark:!bg-transparent ">
        <p className="text-gray-600 opacity-90 text-[20px] text-center dark:text-white ">
          {selectedRoom && `Controls - ${selectedRoom.replace(/([A-Z])/g, ' $1').trim()}`}
        </p>
        <Room onSelectedRoom={setSelectedRoom} />
      </div>
      <div className="deviceContrl flex flex-col gap-4 min-h-screen">
        <div className="-ml-[58px] mt-36">
          <ACControl
         
            toggleAC={toggleAC}
           
            increaseTemperature={increaseTemperature}
            decreaseTemperature={decreaseTemperature}
            setInitialTemperature={setInitialTemperature}
            selectedRoom={selectedRoom}
            increaseFanSpeed={increaseFanSpeed}
            decreaseFanSpeed={decreaseFanSpeed}
            fanSpeed={fanSpeed}
            increaseLightBrightness={increaseLightBrightness}
            decreaseLightBrightness={decreaseLightBrightness}
            lightBrightness={lightBrightness}
          />
        </div>
        <div className="LightFanControl ml-3 flex flex-col gap-2">
          <FanControl
            increaseFanSpeed={increaseFanSpeed}
            decreaseFanSpeed={decreaseFanSpeed}
            fanSpeed={fanSpeed}
            selectedRoom={selectedRoom} />
          <LightControl
            increaseLightBrightness={increaseLightBrightness}
            decreaseLightBrightness={decreaseLightBrightness}
            lightBrightness={lightBrightness}
            selectedRoom={selectedRoom} />
        </div>
      </div>
    </div>
  );
};

export default LeftMOBILE;
