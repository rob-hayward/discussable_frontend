import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useLogout from "../../hooks/useLogout";
import axiosInstance from "../../api/axiosConfig";
import './DashboardPage.css';

const DashboardPage = () => {
  const logout = useLogout();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Immediately invoke the async function inside useEffect
    (async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return; // Early return to avoid further execution if there's no token
      }

      try {
        const response = await axiosInstance.get('/user/profile/');
        setUserProfile(response.data); // Assuming the API returns user profile data
      } catch (error) {
        console.error('Error fetching user profile:', error);
        logout(); // Log out if fetching user profile fails
      }
    })();
  }, [navigate, logout]); // Assuming logout is stable across renders, otherwise consider using a callback hook or moving logout function inside useEffect if it doesn't depend on external state

  return (
    <div className="dashboard-container">
      <img src={`${process.env.PUBLIC_URL}/AuthenTechLogo.png`} alt="AuthenTech Logo" className="logo"/>
      <h1 className="dashboard-heading">Discussable Dashboard</h1>
      {userProfile && <p>Welcome, {userProfile.preferred_name}!</p>} {/* Display user's preferred name */}
      <div className="dashboard-options">
        <Link to="/create-discussion" className="dashboard-link">Start a New Discussion</Link>
        <Link to="/discussions" className="dashboard-link">Join an Existing Discussion</Link>
      </div>
      <div className="auth-options">
        <button onClick={logout} className="logout-button">Logout</button>
      </div>
    </div>
  );
};

export default DashboardPage;
