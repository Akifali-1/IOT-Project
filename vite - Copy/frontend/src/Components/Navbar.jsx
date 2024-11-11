import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Navbar.css';
import userI from '../assets/user.svg';
import home from '../assets/home.svg';
import message from '../assets/message.svg';
import reports from '../assets/reports.svg';
import settings from '../assets/settings.svg';
import devises from '../assets/devises.svg';
import log from '../assets/log.svg';
import logout from '../assets/logout.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './Dashboard';


const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isSignup, setIsSignup] = useState(false); 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedEmail = localStorage.getItem('email');
    if (storedUsername) setUsername(storedUsername);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target) && isOpen) {
      setIsOpen(false);
    }
  };

  const handleNavLinkClick = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('token');
    setUsername('');
    setEmail('');
    navigate('/');
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', formData.name);
      localStorage.setItem('email', formData.email);
      setUsername(formData.name);
      setEmail(formData.email);
      toast.success('Signed up successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred during signup');
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        { email: formData.email, password: formData.password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username); // Ensure username comes from the response
      localStorage.setItem('email', formData.email);
      setUsername(data.username); 
      setEmail(formData.email);
      toast.success('Logged in successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred during login');
    }
  };

  return (
    <>
      <ToastContainer />
      <div className={`side-nav dark:bg-slate-800 hover:dark:border-r-[1px] hover:dark:border-slate-600 ${isOpen ? 'open' : 'close1'}`} ref={sidebarRef}>
        {!isOpen && (
          <div className="hamburger" onClick={toggleSidebar}>
            <div className="ham">
              <svg className="dark:fill-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40" fill="indigo">
                <path d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
              </svg>
            </div>
          </div>
        )}
        <div className="user">
          <div className="logo ">
            <img src={userI} className='opacity-100' alt="User Icon" />
          </div>
          <h1>iSmart</h1>
        </div>
        <ul className="list">
          <NavLink to="/dashboard" onClick={handleNavLinkClick} className={({ isActive }) => (isActive ? 'nav-active' : '')}>
            <li>
              <i><img src={home} alt="Dashboard Icon" /></i>
              <h2>Dashboard</h2>
            </li>
          </NavLink>
          <NavLink to="/devices" onClick={handleNavLinkClick} className={({ isActive }) => (isActive ? 'nav-active' : '')}>
            <li>
              <i><img src={devises} alt="Devices Icon" /></i>
              <h2>Devices</h2>
            </li>
          </NavLink>
          <NavLink to="/contact" onClick={handleNavLinkClick} className={({ isActive }) => (isActive ? 'nav-active' : '')}>
            <li>
              <i><img src={message} alt="Contact Icon" /></i>
              <h2>Contact Us</h2>
            </li>
          </NavLink>
          <NavLink to="/reports" onClick={handleNavLinkClick} className={({ isActive }) => (isActive ? 'nav-active' : '')}>
            <li>
              <i><img src={reports} alt="Reports Icon" /></i>
              <h2>Reports</h2>
            </li>
          </NavLink>
          <NavLink to="/settings" onClick={handleNavLinkClick} className={({ isActive }) => (isActive ? 'nav-active' : '')}>
            <li>
              <i><img src={settings} alt="Settings Icon" /></i>
              <h2>Settings</h2>
            </li>
          </NavLink>
          <li onClick={handleLogout} className="logout">
            <i><img src={logout} alt="Logout Icon" /></i>
            <h2>Log out</h2>
          </li>
        </ul>
        <hr className="border-t-2 border-azure -ml-1 mr-14 text-white my-24" />
        <div className="log overflow-hidden">
          <img src={log} alt="Log Icon" className="us " />
          <div>
            <h2 className='dark:text-slate-400 text-slate-400 -ml-1'>{username || 'User Name'} <br />{email || 'email@example.com'}</h2>
          </div>
        </div>
        </div>
      
    </>
  );
};

export default Navbar;
