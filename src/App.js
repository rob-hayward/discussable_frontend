// src/App.js

import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import WelcomePage from './components/AuthenTech/WelcomePage';
import LoginPage from './components/AuthenTech/LoginPage';
import RegistrationPage from './components/AuthenTech/RegistrationPage';
import DashboardPage from './components/AuthenTech/DashboardPage';
import EmailVerification from './components/AuthenTech/EmailVerification';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
    <UserProvider>
      <Router>
          <Routes>
              <Route path="/" element={<WelcomePage/>} exact/>
              <Route path="/login" element={<LoginPage/>}/>
              <Route path="/register" element={<RegistrationPage/>}/>
              <Route path="/dashboard" element={<DashboardPage/>}/>
              <Route path="/verify-email/:token" element={<EmailVerification/>}/>
          </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;


