import React, { useEffect } from 'react';
import ac from '../assets/ac.jpg';
import './ACControl.css'

const ACControl = ({
  isOn,
  toggleAC,
  temperature,
  increaseTemperature,
  decreaseTemperature,
  setInitialTemperature,
  selectedRoom,
}) => {
 

  return (
    <div className="cardx as ml-20 mt-2 p-3 h-[305px] rounded-[43px] text-center w-[400px] lg:w-[25vw] sm:size-[300px] ">
      <h2 className="text-lg flex justify-center font-semibold text-gray-800 dark:text-white mb-3">
        <span className="ac">
          <img
            src={ac}
            alt="Air Conditioner icon"
            className="w-8 opacity-70 mr-5 dark:opacity-25 bg-slate-200 rounded-[14px] p-[5px]"
          />
        </span>
        Air Conditioner
      </h2>

      {/* Temperature Display */}
      <div className="text-3xl font-bold mb-4 dark:text-indigo-500 text-blue-600 opacity-90">
        {temperature}°C
      </div>

      {/* Temperature Adjustment Buttons */}
      <div className="flex justify-center mb-4 space-x-4">
        <button
          onClick={decreaseTemperature}
          className="px-4 py-2 dark:text-white dark:bg-[#ffffff20] dark:hover:bg-[#ffffff8c] text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition"
        >
          -
        </button>
        <button
          onClick={increaseTemperature}
          className="px-4 py-2 dark:text-white dark:bg-[#ffffff20] dark:hover:bg-[#ffffff94] text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200 transition"
        >
          +
        </button>
      </div>

      {/* Set Initial Temperature Button */}
      <div className="text-sm font-thin mb-4">
        <span>Temperature: </span>
        <span className="text-indigo-500">{temperature}°C</span>
        <button
          onClick={setInitialTemperature}
          className="ml-3 dark:bg-[#ffffff20] dark:text-indigo-50 dark:hover:bg-[#ffffff37] px-4 py-1 rounded-full bg-blue-200 text-blue-800 hover:bg-blue-300 transition font-normal"
        >
          Set Temp
        </button>
      </div>

      {/* AC Toggle Button */}
      <button
        onClick={toggleAC}
        className={`w-44 py-2 rounded-full font-bold transition ${isOn
          ?'bg-blue-600 hover:bg-blue-500 dark:bg-[#BE48ED] dark:bor dark:border-[3.5px] dark:bg-opacity-80 dark:border-purple-950 text-gray-200 dark:hover:bg-[#eb9de6da]'
          :  'bg-[#DCE5FD] hover:bg-blue-600 dark:bg-[#ffffff15] text-white dark:hover:bg-[#ffffff2b]'
          }`}
      >
        {isOn ? 'Turn Off' : 'Turn On'}
      </button>
    </div>
  );
};

export default ACControl;
