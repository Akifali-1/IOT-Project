import React, { useState } from 'react';
import './LightFanControl.css'; // Import the external CSS file

const FanControl = ({
  increaseFanSpeed,
  decreaseFanSpeed,
  fanSpeed,
  selectedRoom
}) => {

  return (
    <div className="control-container rounded-[35px] w-[380px] h-[135px] sm:w-[320px] cardx">
      <div className="fan_icon"></div>
      <div className="leftC">

        <div className="control-title dark:text-slate-400">Fan Speed</div>
        <div className="control-value"><div className="control-value">{fanSpeed[selectedRoom]}</div>
        </div>
      </div>
      <div className="control-buttons bg-[#DCE5FD] h-[105px] w-[50px] rounded-2xl text-blue-500  text-xl">
        <button className="pb-3 pt-2 hover:bg-blue-200 rounded-2xl" onClick={increaseFanSpeed}>+</button>
        <button className="pt-2 pb-3 hover:bg-blue-200 rounded-2xl" onClick={decreaseFanSpeed}>-</button>
      </div>
    </div>
  );
};

export default FanControl;