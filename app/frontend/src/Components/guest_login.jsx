import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import email_icon from '../assets/email.png';
import LeftPanelImage from '../assets/download.png'; // Transparent background image

const Guest_Login = () => {
    const [email, setEmail] = useState(''); // useState for email
    const navigate = useNavigate();

    // Handle email input change
    const handleChange = (e) => {
        setEmail(e.target.value); // Update email state
    };
    const handleHomeClick = () => {
        navigate('/'); // Redirect to the home page ("/")
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter an email!');
            return;
        }

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/auth/guest_login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email }), // Send email in the body
                }
            );

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message || 'Guest verified successfully!');
                setTimeout(() => navigate('/guest'), 1000);
            } else {
                toast.error(data.message || 'Verification failed.');
            }
        } catch (error) {
            console.error('Error verifying guest email:', error);
            toast.error('Something went wrong. Please try again.');
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
                    <h2 className="right-title">Login as Guest</h2>
                    <form className="signup-form" onSubmit={handleSubmit}>
                        <div className="form-input">
                            <img src={email_icon} alt="email icon" />
                            <input
                                type="email"
                                placeholder="Enter your email"
                                name="email"
                                value={email} // Bind email state here
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="signup-button">Login</button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Guest_Login;
