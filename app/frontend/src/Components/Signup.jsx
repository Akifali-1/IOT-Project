import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import person_icon from '../assets/person.png';
import email_icon from '../assets/email.png';
import password_icon from '../assets/password.png';
import LeftPanelImage from '../assets/download.png'; // Transparent background image

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(''); // Error state
  const navigate = useNavigate();

  // Handle input field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error on typing
  };
  const handleHomeClick = () => {
    navigate('/'); // Redirect to the home page ("/")
  };

  // Handle form submission
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Save data in local storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', formData.name);
      localStorage.setItem('email', formData.email);

      toast.success('Signed up successfully!');

      // Redirect to dashboard after success
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.msg || 'Error signing up. Please try again.';
      setError(errorMessage); // Set error message

      toast.error(errorMessage);
    }
  };

  return (
    <div className="bod">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        closeOnClick
        pauseOnHover
        draggable={false}
        className="toast-container"
      />
      <div className="header">
        <div className="left-header">
          <h1>G-160</h1>
        </div>
        <div className="right-header">
          <button className="home-btn" onClick={handleHomeClick}>
            <h1>Home</h1>
          </button>
        </div>
      </div>

      <div className="signup-container">
        {/* Left Panel */}
        <div className="left-panel">
          <img
            src={LeftPanelImage}
            alt="Innovative Decision Concept"
            className="left-image"
          />
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          <h1 className="right-title">Sign Up</h1>
          <form className="signup-form" onSubmit={handleSignupSubmit}>
            {/* Name Input */}
            <div className="form-input">
              <img src={person_icon} alt="person icon" />
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email Input */}
            <div className="form-input">
              <img src={email_icon} alt="email icon" />
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password Input */}
            <div className="form-input">
              <img src={password_icon} alt="password icon" />
              <input
                type="password"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="signup-button">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
