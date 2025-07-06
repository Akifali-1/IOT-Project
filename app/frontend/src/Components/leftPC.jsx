import ACControl from './ACControl.jsx'; // Adjust path if necessary
import FanControl from './Fan_Control.jsx';
import LightControl from './LightControl.jsx';

import WeeklyUsageChart from './WeeklyUsageChart';

const handleLogout = () => {
  window.location.href = "/";
};



const LeftSection = ({
  userName,
  selectedRoom,
  acStatus = {},
  toggleAC,
  temperature = {},
  increaseTemperature,
  decreaseTemperature,
  setInitialTemperature,
  increaseFanSpeed,
  decreaseFanSpeed,
  fanSpeed,
  increaseLightBrightness,
  decreaseLightBrightness,
  lightBrightness
}) => {
  const isAcOn = acStatus[selectedRoom] ?? false; // Default to false if undefined
  const roomTemperature = temperature[selectedRoom] ?? 16; // Default to 16 if undefined

  const isGuest = window.location.pathname.includes('/guest');


  return (
    <div className="left flex flex-col w-full lg:w-[65vw] min-h-screen p-4  sm:block tb:block md1-block overflow-hidden">
      <div className="w-full max-w-[90vw] mx-auto mt-4 lg:max-w-[800px]">
        <h1 className="text-[24px] dark:text-slate-400 font-thin text-gray-800">
          Hey, <span className="font-bold">{userName || 'User'} 👋🏻</span> Welcome to Dashboard
        </h1>
        <p className="text-gray-600 dark:text-indigo-300 opacity-60 text-[14px] font-normal">
          {selectedRoom && `You are viewing: ${selectedRoom.replace(/([A-Z])/g, ' $1').trim()}`}
        </p>
      </div>
      <div className="deviceControl">
        <div className="mt-[21px] text-sm">
          <ACControl
            isOn={isAcOn}
            toggleAC={toggleAC}
            temperature={roomTemperature}
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
        <div className="LightFanControl">
          <FanControl
            increaseFanSpeed={increaseFanSpeed}
            decreaseFanSpeed={decreaseFanSpeed}
            fanSpeed={fanSpeed}
            selectedRoom={selectedRoom}
          />
          <LightControl
            increaseLightBrightness={increaseLightBrightness}
            decreaseLightBrightness={decreaseLightBrightness}
            lightBrightness={lightBrightness}
            selectedRoom={selectedRoom} />
        </div>

      </div>
      {!isGuest ? (
        <div className="">
          <WeeklyUsageChart />
        </div>
      ) : (
        <button
          onClick={handleLogout}
          className="mt-6 bg-red-500 text-white py-2 px-4 rounded-full hover:bg-red-600 transition duration-300"
        >
          Log Out
        </button>
      )}

    </div>
  );
};
export default LeftSection;
