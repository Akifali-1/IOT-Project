import React, { useEffect, useState } from 'react';

import './temp.css';


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
    initializeWebSocket();
    const unsubscribe = subscribeToMessages((message) => {
      const { device, temperature, room } = message;
      if (device === 'temperature_sensor' && room === 'livingroom') {
        setTemperature(temperature);
      }
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, []);

  return (
    <div className="container darktemp bg-[#90b2ff] text-white w-[90vw] lg:w-96 mt-4 mb-4 sm:w-[90%] sm:h-28">
      <div className="background">
        <div className="Circle1"></div>
        <div className="Circle2"></div>
        <div className="Circle3"></div>
      </div>
      <div className="content">
        <div className="content-header">
          <div className="status-icons">
            <img className="size-5 invert opacity-80" src="/assets/wifi.png" alt="wifi status" />
            <img className="size-5 invert opacity-90" src="/assets/sensor.png" alt="sensor status" />
          </div>
          <span className="time">{time}</span>
        </div>
        <div className="content-body">
          <img className="cloud2" src="/assets/ai.png" alt="sensor illustration" />
          <span className="temperature">
            {`${temperature}°`}
            <span className="temperature-unit">C</span>
          </span>
        </div>
        <span className="updated-label">Last updated</span>
      </div>
    </div>
  );
};

export default Temp;
