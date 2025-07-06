import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = ({ isAuthenticated }) => {
    return (
        <>
            <div className="head">
                <div className="top">
                    <div className="left">
                        <div className='homelogo'><Link to="/"></Link></div>
                        <div className='g160'><Link to="/">G-160</Link></div>

                    </div>

                    <div className="sec1"></div>
                    <div className="right">
                        <Link to="/login">
                            <button className='home-button'>Login</button>
                        </Link>
                        <Link to="/signup">
                            <button className='home-button'>Sign Up</button>
                        </Link>
                        <Link to="/guest_login">
                            <button className='home-button'>Guest's Login</button>
                        </Link>
                    </div>
                </div>
                <div className='second'>
                    
                    <div className='H1'>MAKE YOUR LIFE MORE COMFORTABLE</div>

                    <div className='H2'>
                        Transforming comfort into a seamless experience.
                    </div>
                    <div className="card1">
                        <div className="card2">
                            <div className="card21"></div>
                            <img src="src/assets/dashboard_mobile.jpg" className='card22' alt="" />
                        </div>
                    </div>
                    <Link to="/guest_login">
                        <button className='joinbtn'>LOGIN AS GUEST</button>
                    </Link>
                    
                    <div className='home-container'>
                        <h1 className='home-title'>Welcome to Our App</h1>
                        <div className="canbody">
                            <div className="containerleft">
                                Effortlessly control your surroundings with our IoT-based voice automation system. From home to office, hotel, or outdoor spaces, manage lighting, security, and climate with a simple command. Experience the ease and convenience of a smart, responsive environment tailored to your daily life.
                            </div>
                            <img src="src/assets/image1.jpg" className='containeright' alt="iot image" />
                        </div>
                    </div>

                </div>
            </div>
            <main>
            <div className="third">
                    <div className="head3 dark:text-violet-200">Control Your Appliances With Ease And Comfort</div>
                    <div className="body3 dark:bg-slate-500 ">
                        <div className="left3 dark:text-white dark:bg-slate-800">
                            <div className="im1"></div>
                            <div className="im2"></div>
                            <div className="im3"></div>
                            <div className="im4"></div>
                            <div className="im5"></div>
                            <div className="im6"></div>
                        </div>
                        <div className="right3"><b>Convenience and Control:</b> Voice commands provide seamless, hands-free management of home devices for enhanced user comfort.
                            <br />
                            <br />
                            <b>Energy Efficiency:</b> Automated scheduling and smart device control help optimize energy usage, lowering costs.
                            <br />
                            <br />
                            <b>Enhanced Security:</b> Advanced encryption and user authentication ensure data privacy and protection against unauthorized access.
                            <br />
                            <br />
                            <b>Customizability and Scalability:</b> The system supports tailored setups and can expand with new devices as needed.</div>
                    </div>
                    <div className="thirdbtns">
                        <Link to="/login">
                            <button className='thirdbtn'>LOGIN</button>
                        </Link>
                        <Link to="/signup">
                            <button className='thirdbtn'>SIGN UP</button>
                        </Link>
                    </div>
                </div>
                <div className="fourth dark:bg-violet-900">
                    <div className="top4">You will gain access to...</div>

                    <div className="body4">
                        <div className="grid">
                            <div className="item item1">
                                <div className="itemhead">Control</div>

                                <div className="img1"></div>
                                <div className="itembody">
                                    Seamlessly control your home appliances, such as fans, lights, and AC, through voice commands or mobile access.
                                </div>

                                <div className='buttons'>
                                    <Link to="/signup">
                                        <button className='btn1'>Get Access</button>
                                    </Link >
                                    <Link to="/help">

                                        <button className='btn2'>Need Help?</button>
                                    </Link >

                                </div>
                            </div>
                            <div className="item item2">
                                <div className="itemhead">SmartSave</div>

                                <div className="img2"></div>
                                <div className="itembody">
                                    Monitor your appliance usage history to optimize performance and save energy
                                </div>
                                <div className='buttons'>
                                    <Link to="/signup">
                                        <button className='btn1'>Get Access</button>
                                    </Link>
                                    <Link to="/help">

                                        <button className='btn2'>Need Help?</button>
                                    </Link>

                                </div>
                            </div>
                            <div className="item item3">
                                <div className="itemhead">Temp Insight</div>

                                <div className="img3"></div>
                                <div className="itembody">
                                    Access real-time temperature insights to make informed decisions on device usage.
                                </div>
                                <div className='buttons'>
                                    <Link to="/signup">
                                        <button className='btn1'>Get Access</button>
                                    </Link>
                                    <Link to="/help">

                                        <button className='btn2'>Need Help?</button>
                                    </Link>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="pop">
                    <Link to="/help">
                        Help?
                    </Link></div>
                <div className="bottom">
                    <ul>
                        <li><Link to="/"> Home</Link></li>
                        <li><Link to="/help">Help?</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/signup">SignUp</Link></li>
                        <li><Link to="/guest_login">Login As Guest</Link></li>
                    </ul>
                </div>

            </main>

        </>
    );
};

export default Home;
