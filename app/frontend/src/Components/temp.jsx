import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ai from '../assets/ai.png';
import './temp.css';
import sensor from '../assets/sensor.png';
import wifi from '../assets/wifi.png';

import { initializeWebSocket, subscribeToMessages } from './websocketUtils';

const Temp = () => {
  const [temperature, setTemperature] = useState("24");
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    // Initialize WebSocket and listen for temperature updates
    const socket = initializeWebSocket();
    subscribeToMessages((message) => {
      const { device, temperature, room } = message;
      if (device === 'temperature_sensor' && room === 'livingroom') {
        setTemperature(temperature);
      }
    });

    return () => {
      clearInterval(interval);
      socket.close(); // Clean up WebSocket connection
    };
  }, []);

  return (
    <div className="container darktemp bg-[#90b2ff] text-white w-[90vw] lg:w-96 mt-4 mb-4 sm:w-[90%] sm:h-28">
      <div className="background">
        <div className="Circle1"></div>
        <div className="Circle2"></div>
        <div className="Circle3"></div>
        <div className="content">
          <h1 className="Condition">
            <li className="flex gap-2 mb-3">
              <img className="size-5 invert opacity-80" src="/assets/wifi.png" alt="" />
              <img className="size-5 invert opacity-90 " src="/assets/sensor.png" alt="" />
            </li>
            <i>
              <img className="w-40 cloud2 -mt-8 sm:-ml-3 sm:w-32 sm:-mt-6" src="/assets/ai.png" alt="" />
            </i>
          </h1>
          <h1 className="Temp mb-2 ml-[165px] text-[30px] sm:ml-[110px]">
            {`${temperature}°`}<span className="font-serif">C</span>
          </h1>
          <h1 className="Time">{time}</h1>
          <h1 className="Location">Last updated</h1>
        </div>
      </div>
    </div>
  );
};

export default Temp;
