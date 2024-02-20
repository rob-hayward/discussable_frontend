// src/App.js

import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import WelcomePage from './components/AuthenTech/WelcomePage';
import LoginPage from './components/AuthenTech/LoginPage';
import RegistrationPage from './components/AuthenTech/RegistrationPage';
import DashboardPage from './components/AuthenTech/DashboardPage';
import EmailVerification from './components/AuthenTech/EmailVerification';
import CreateDiscussionPage from './components/Discussable/CreateDiscussionPage';
import DiscussionsListPage from './components/Discussable/DiscussionsListPage';
import DiscussionDetailPage from './components/Discussable/DiscussionDetailPage';
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';

library.add(faBars);

function App() {
  return (
    <AuthProvider>
        <UserProvider>
          <Router>
              <Navbar />
              <Routes>
                  <Route path="/" element={<WelcomePage/>} exact/>
                  <Route path="/login" element={<LoginPage/>}/>
                  <Route path="/register" element={<RegistrationPage/>}/>
                  <Route path="/dashboard" element={<DashboardPage/>}/>
                  <Route path="/verify-email/:token" element={<EmailVerification/>}/>
                  <Route path="/create-discussion" element={<CreateDiscussionPage/>}/>
                  <Route path="/discussions" element={<DiscussionsListPage/>}/>
                  <Route path="/discussions/:discussionId" element={<DiscussionDetailPage />} />
              </Routes>
          </Router>
        </UserProvider>
    </AuthProvider>
  );
}

export default App;


