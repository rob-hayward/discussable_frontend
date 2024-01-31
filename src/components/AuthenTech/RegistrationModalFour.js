// src/components/AuthenTech/RegistrationModalFour.js
import React, { useState } from 'react';
import './RegistrationModalFour.css';
import useWebAuthnRegistration from '../../hooks/useWebAuthnRegistration';
import { useUser } from '../../contexts/UserContext'; // Import useUser


const ModalFour = ({ onRegistrationComplete }) => {
  const { userDetails } = useUser(); // Use context
  console.log("Email in ModalFour:", userDetails.email);
  const { initiateWebAuthnRegistration, error } = useWebAuthnRegistration();
  const [registrationError, setRegistrationError] = useState('');

  const handleWebAuthnRegister = async () => {
    try {
      console.log("Attempting WebAuthn registration with email:", userDetails.email);
      const result = await initiateWebAuthnRegistration(userDetails.email); // Use email from context
      if (result && result.status === 'success') {
        onRegistrationComplete();
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'An error occurred during registration.';
      setRegistrationError(errorMessage);
    }
  };

  return (
    <div className="modalContainerFour"> {/* Apply the CSS class */}
      <img src={`${process.env.PUBLIC_URL}/AuthenTechLogo.png`} alt="AuthenTech Logo" className="logoSmall"/>
      <p className="paragraphFour">
        Complete your AuthenTech registration by using finger print or face scan on you device with WebAuthn.
      </p>
      <button className="buttonFour" onClick={handleWebAuthnRegister}>Register with WebAuthn</button>
      {registrationError && <p className="errorFour">Error: {registrationError}</p>}
      {error && <p className="errorFour">Error: {error.message}</p>}
      <div className="step-indicator">Step 4 of 4</div>
    </div>
  );
};

export default ModalFour;