// src/components/AuthenTech/WelcomePage.js

import React from 'react';
import { Link } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  return (
      <div className="welcome-page">
          {/* Logo Image */}
          <img src={`${process.env.PUBLIC_URL}/AuthenTechLogo.png`} alt="AuthenTech Logo" className="logo"/>

          <h1>AuthenTech</h1>
          <div className="paragraph-container">
              <ul>
                  <li>Seamless, simple, personal security.</li>
                  <li>Convenient, one-touch, passwordless access.</li>
                  <li>Advanced biometric authentication for robust security.</li>
              </ul>
              <div className="auth-options">
              <Link to="/register" className="auth-link">Register</Link>
                  <Link to="/login" className="auth-link">Login</Link>
              </div>
          </div>


      </div>
  );
};

export default WelcomePage;
