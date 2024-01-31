// src/components/AuthenTech/DashboardPage.js

import React from 'react';
import useLogout from '../../hooks/useLogout';
import './DashboardPage.css';


const DashboardPage = () => {
  const logout = useLogout();
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
                  <button onClick={logout} className="logout-button">Logout</button>
              </div>
          </div>


      </div>
  );
};

export default DashboardPage;

