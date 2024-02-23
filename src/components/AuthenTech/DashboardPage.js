// src/components/AuthenTech/DashboardPage.js
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/AuthContext"; // Import useAuth
import axiosInstance from "../../api/axiosConfig";

const DashboardPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    (async () => {
      try {
        const response = await axiosInstance.get('/user/profile/');
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        logout(); // No need for additional navigation code here
      }
    })();
  }, [navigate, logout]);

  return (
      <div className="dashboard-container">
        <img src={`${process.env.PUBLIC_URL}/speech_bubble.png`} alt="Discussable Logo" className="logo"/>
        <h1 className="dashboard-heading">Discussable Dashboard</h1>
        {userProfile && <p>Welcome, {userProfile.preferred_name}!</p>} {/* Display user's preferred name */}
        <div className="dashboard-options">
          <Link to="/create-discussion" className="dashboard-link">Start a New Discussion</Link>
          <Link to="/discussions" className="dashboard-link">Join an Existing Discussion</Link>
        </div>
        <div className="auth-options">
          <button onClick={() => {
            logout(); // Call logout from AuthContext
            navigate('/'); // Navigate to the welcome page
          }} className="logout-button">Logout
          </button>
        </div>
      </div>
  );
};

export default DashboardPage;