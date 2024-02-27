// src/components/AuthenTech/WelcomePage.js

import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './WelcomePage.css';

const WelcomePage = () => {
  return (
      <div className="welcome-page">
          {/* Logo Image */}
          <img src={logo} alt="Discussable Logo" className="logo"/>

          <h1>Discussable</h1>
          <div className="paragraph-container">
              <ul>
                  <li>Freedom to speak.</li>
                  <li>Freedom to listen.</li>
                  <li>Community control, personal control.</li>
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
