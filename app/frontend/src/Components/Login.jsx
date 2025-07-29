import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginSignup.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ setUsername, setIsAuthenticated }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleHomeClick = () => {
        navigate('/'); // Redirect to the home page ("/")
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/auth/login`,
                formData,
                { headers: { 'Content-Type': 'application/json' } }
            );

            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('email', formData.email);

            setIsAuthenticated(true);
            setUsername(data.username);

            toast.success('Logged in successfully!');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.message || 'Error logging in. Please try again.';
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
                        src="/assets/download.png"
                        alt="Innovative Decision Concept"
                        className="left-image"
                    />
                </div>

                {/* Right Panel */}
                <div className="right-panel">
                    <h2 className="right-title">Login</h2>
                    <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="form-input">
                            <img src="/assets/email.png" alt="email icon" />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-input">
                            <img src="/assets/password.png" alt="password icon" />
                            <input
                                type="password"
                                placeholder="Enter your password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="signup-button">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
