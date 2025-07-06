import React, { useState, useEffect } from 'react';

const SettingsPage = () => {

    // Initialize state with localStorage value or default to false
    const [isDarkMode, setIsDarkMode] = useState(() => {
      return localStorage.getItem('darkMode') === 'true';
    });
  
    useEffect(() => {
      // Add or remove the `dark` class based on the state
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      // Store the state in localStorage
      localStorage.setItem('darkMode', isDarkMode);
    }, [isDarkMode]);
  return (
    <div className="dark:bg-[#081229] sm:mt-12 min-h-screen bg-gray-100 flex flex-col items-center py-8">
      <div className="bg-white w-full max-w-4xl shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Smart Home Settings</h2>
        
        {/* Wi-Fi Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Wi-Fi Configuration</h3>
          <div className="flex flex-col space-y-4">
            <input 
              type="text" 
              placeholder="Wi-Fi SSID" 
              className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input 
              type="password" 
              placeholder="Wi-Fi Password" 
              className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700">
              Save Wi-Fi Settings
            </button>
          </div>
        </div>

        {/* Device Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Device Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Device Name</label>
              <input 
                type="text" 
                placeholder="Living Room Light" 
                className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select 
                className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="on">On</option>
                <option value="off">Off</option>
              </select>
            </div>
          </div>
        </div>

        {/* User Preferences */}
        <div className="mb-6 dark:text-black">
          <h3 className="text-lg font-medium text-gray-700 mb-3">User Preferences</h3>
          <div className="flex flex-col space-y-4">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500"
              />
              Enable Notifications
            </label>
            <label className="flex items-center">
      <input
        type="checkbox"
        checked={isDarkMode}
        onChange={(e) => setIsDarkMode(e.target.checked)}
        className="mr-3 h-5 w-5 text-indigo-600 focus:ring-indigo-500"
      />
      Dark Mode
    </label>
          </div>
        </div>

        {/* General Settings */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-3">General Settings</h3>
          <button className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700">
            Reset to Factory Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
