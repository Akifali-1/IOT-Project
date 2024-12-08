import React, { useState } from 'react';
import './LightFanControl.css';

const LightControl = ({ increaseLightBrightness, decreaseLightBrightness, lightBrightness, selectedRoom }) => {
  const brightness = lightBrightness[selectedRoom]; // Get the brightness for the selected room

  return (
    <div className="cardx control-container rounded-[40px] w-[380px] h-[135px] sm:w-[320px] ">
      <div className="light_icon"></div>
      <div className="leftC">
        <div className="control-title dark:text-slate-400">Light Brightness</div>
        <div className="control-value text-[35px] font-semibold">
          {brightness}%
          {brightness === 50 && <span className="text-gray-500 text-[20px] ml-2">(Dim)</span>}
          {brightness === 100 && <span className="text-yellow-400 text-[20px] ml-2">(Bright)</span>}
        </div>
      </div>
      <div className="control-buttons bg-[#DCE5FD] h-[105px] w-[50px] rounded-2xl text-blue-500 text-xl">
        <button
          className="pb-3 pt-2 hover:bg-blue-200 rounded-2xl"
          onClick={() => increaseLightBrightness(selectedRoom)}
        >
          +
        </button>
        <button
          className="pt-2 pb-3 hover:bg-blue-200 rounded-2xl"
          onClick={() => decreaseLightBrightness(selectedRoom)}
        >
          -
        </button>
      </div>
    </div>
  );
};

export default LightControl;
