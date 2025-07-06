import React, { useState } from 'react';

function Room({ onSelectedRoom }) {
  // Use state to track the selected room
  const [selectedRoom, setSelectedRoom] = useState('LivingRoom');

  // Handle room selection
  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    onSelectedRoom(room); // Pass the selected room to the parent
  };

  return (
    <div className='mx-auto lg:relative text-md text-slate-400 dark:text-white mt-4 sm:!mt-2 mb-3'>
      <nav className='flex gap-3 sm:w-[100vw] sm:text-[15px]'>
        {/* Living Room Button */}
        <button
          className={`rounded-full py-[5px] px-[6px] lg:px-[10px] font-medium  ${
            selectedRoom === 'LivingRoom' 
              ? 'bg-[#0f1f4e] text-white  dark:bg-[#304793]'
              : 'bg-[#e9efff] text-[#0f1f4e] dark:bg-[#e9efff1b] dark:text-white'
          } lg:hover:bg-[#0F1B4C] focus:bg-[#0F1B4C] hover:text-white focus:text-white lg:focus:font-medium`}
          onClick={() => handleRoomSelect('LivingRoom')}
        >
          Living Room
        </button>

        {/* Kitchen Button */}
        <button
          className={`rounded-full py-[5px] px-[6px] lg:px-[10px] font-medium ${
            selectedRoom === 'Kitchen'
              ? 'bg-[#0f1f4e] text-white dark:bg-[#304793]'
              : 'bg-[#e9efff] text-[#0f1f4e] dark:bg-[#e9efff1b] dark:text-white'
          } lg:hover:bg-[#0F1B4C] focus:bg-[#0F1B4C] hover:text-white focus:text-white lg:focus:font-medium`}
          onClick={() => handleRoomSelect('Kitchen')}
        >
          Kitchen
        </button>

        {/* Bedroom Button */}
        <button
          className={`rounded-full py-[5px] px-[6px] lg:px-[10px] font-medium ${
            selectedRoom === 'Bedroom'
              ? 'bg-[#0f1f4e] text-white dark:bg-[#304793]'
              : 'bg-[#e9efff] text-[#0f1f4e] dark:bg-[#e9efff1b] dark:text-white'
          } lg:hover:bg-[#0F1B4C] focus:bg-[#0F1B4C] hover:text-white focus:text-white lg:focus:font-medium`}
          onClick={() => handleRoomSelect('Bedroom')}
        >
          Bedroom
        </button>

        {/* Outdoor Button */}
        <button
          className={`rounded-full py-[5px] px-[6px] lg:px-[10px] font-medium ${
            selectedRoom === 'Outdoor'
              ? 'bg-[#0f1f4e] text-white dark:bg-[#304793]'
              : 'bg-[#e9efff] text-[#0f1f4e] dark:bg-[#e9efff1b] dark:text-white'
          } lg:hover:bg-[#0F1B4C] focus:bg-[#0F1B4C] hover:text-white focus:text-white lg:focus:font-medium`}
          onClick={() => handleRoomSelect('Outdoor')}
        >
          Outdoor
        </button>
      </nav>
    </div>
  );
}

export default Room;
