// App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Dashboard from './Components/Dashboard.jsx';
import Device from './Components/device.jsx';
import Navbar from './Components/Navbar';
import Login from './Components/Login.jsx';
import Signup from './Components/Signup.jsx';
import Home from './Components/Home.jsx';
import Contact from './Components/Contact.jsx';
import Reports from './Components/Reports.jsx';
import Guest from './Components/guest.jsx';
import Guest_Login from './Components/guest_login.jsx';
import Help from './Components/Help.jsx';
import BillPage from './Components/BillPage';
import Bottom from './Components/bottom.jsx';
import Left from './Components/leftMOBILE.jsx';
import SettingsPage from './Components/settings.jsx';
function AppContent({ darkMode, setDarkMode, isAuthenticated, setIsAuthenticated, setUsername }) {
    const location = useLocation();

    // Define paths where the Navbar should be hidden
    const hideNavbarPaths = ['/', '/login', '/signup', '/help', '/guest', '/guest_login'];
    const showNavbar = !hideNavbarPaths.includes(location.pathname);

    return (
        <>
     <div className="bg-[#355dff69] dark:bg-gradient-to-br from-[#081229] to-[#1b1e382e] lg:!bg-transparent lg:shadow-transparent lg:!-ml-[33vw]  lg:mt-[35px] header shadow-[0_2px_5px_rgba(0,0,0,0.1)] fixed top-0 z-2 ">


                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="p-2 absolute right-0 bg-slate-300 dark:bg-slate-600 border rounded text-xs my-2 mx-2 dark:text-white dark:opacity-55"
                >
                    Dark Mode
                </button>
            </div> 


            {/* Only show Navbar if the current path is not in the hideNavbarPaths */}
            {showNavbar && <Navbar /> }
            {showNavbar &&   <div className=" w-screen lg:hidden">
                <Bottom/></div>}
            <Routes>
                <Route path="/" element={<Home />} />
                {/* <Route path="/Help" element={<Help />} /> */}
                <Route path="/devices" element={<Device />} />
                <Route path="/reports" element={<Reports />} />
                <Route
                    path="/login"
                    element={<Login setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} />}
                />
                <Route
                    path="/signup"
                    element={<Signup setIsAuthenticated={setIsAuthenticated} />}
                />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/guest_login" element={<Guest_Login />} />
                <Route path="/help" element={<Help />} />
                <Route path="/guest" element={<Guest />} />
                <Route path="/bill" element={<BillPage />} />
                <Route path="/control" element={<Left/>} />
                <Route path="/settings" element={<SettingsPage/>} />

            </Routes>
        </>
    );
}

function App() {
    const [darkMode, setDarkMode] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <Router>
            <AppContent
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
                setUsername={setUsername}
            />
        </Router>
    );
}

export default App;
