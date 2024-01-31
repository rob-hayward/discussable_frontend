// src/components/AuthenTech/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useWebAuthnAuthentication from '../../hooks/useWebAuthnAuthentication';
import './LoginPage.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const { initiateWebAuthnAuthentication, error } = useWebAuthnAuthentication();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await initiateWebAuthnAuthentication(username);
    if (response && response.status === 'success') {
      navigate('/dashboard');  // Redirect to dashboard upon successful login
    }
  };

  return (
    <div className="loginContainer">
      <img src={`${process.env.PUBLIC_URL}/AuthenTechLogo.png`} alt="AuthenTech Logo" className="logoSmall"/>
      <form onSubmit={handleSubmit} className="loginForm">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter Email Address"
          required
          className="loginInput"
        />
        <button type="submit" className="loginButton">Login with WebAuthn</button>
      </form>
      {error && <p className="loginError">Error: {error.message}</p>}
    </div>
  );
};

export default LoginPage;
