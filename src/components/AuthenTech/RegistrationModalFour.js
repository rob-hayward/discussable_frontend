// src/components/AuthenTech/RegistrationModalFour.js
import React, { useState } from 'react';
import './RegistrationModalFour.css';
import useWebAuthnRegistration from '../../hooks/useWebAuthnRegistration';
import { useUser } from '../../contexts/UserContext';
import { useAuth } from '../../contexts/AuthContext';

const ModalFour = ({ onRegistrationComplete }) => {
    const { userDetails } = useUser();
    const { login } = useAuth();
    const { initiateWebAuthnRegistration, error } = useWebAuthnRegistration();
    const [registrationError, setRegistrationError] = useState('');

    const handleWebAuthnRegister = async () => {
        try {
            const result = await initiateWebAuthnRegistration(userDetails.email);
            if (result && result.token) {
                login(result.token); // Pass the token to login method
                onRegistrationComplete();
            } else {
                // Handle registration failure here
                const errorMessage = "Registration failed. Please try again.";
                setRegistrationError(errorMessage);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.message || 'An error occurred during registration.';
            setRegistrationError(errorMessage);
        }
    };

    return (
        <div className="modalContainerFour">
            <img src={`${process.env.PUBLIC_URL}/AuthenTechLogo.png`} alt="AuthenTech Logo" className="logoSmall"/>
            <p className="paragraphFour">
                Complete your AuthenTech registration by using fingerprint or face scan on your device with WebAuthn.
            </p>
            <button className="buttonFour" onClick={handleWebAuthnRegister}>Register with WebAuthn</button>
            {registrationError && <p className="errorFour">Error: {registrationError}</p>}
            {error && <p className="errorFour">Error: {error.message}</p>}
            <div className="step-indicator">Step 4 of 4</div>
        </div>
    );
};

export default ModalFour
