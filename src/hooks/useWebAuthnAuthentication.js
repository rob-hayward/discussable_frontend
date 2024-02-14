// useWebAuthnAuthentication.js
import { useState } from 'react';
import axiosInstance from '../api/axiosConfig';

const useWebAuthnAuthentication = () => {
  const [error, setError] = useState(null);

  const initiateWebAuthnAuthentication = async (username) => {
    try {
      const challengeResponse = await axiosInstance.post('/webauthn/login/challenge/', { username });
      const challengeOptions = challengeResponse.data;

      challengeOptions.challenge = base64urlToUint8Array(challengeOptions.challenge);
      if (challengeOptions.allowCredentials) {
        challengeOptions.allowCredentials = challengeOptions.allowCredentials.map(cred => ({
          ...cred, id: base64urlToUint8Array(cred.id)
        }));
      }

      const assertion = await navigator.credentials.get({ publicKey: challengeOptions });

      const authenticationResponse = {
        credential_id: arrayBufferToBase64(assertion.rawId),
        authenticator_data: arrayBufferToBase64(assertion.response.authenticatorData),
        client_data_json: arrayBufferToBase64(assertion.response.clientDataJSON),
        signature: arrayBufferToBase64(assertion.response.signature),
        user_handle: assertion.response.userHandle ? arrayBufferToBase64(assertion.response.userHandle) : null,
        raw_id: arrayBufferToBase64(assertion.rawId),
        type: 'webauthn.get'
      };

      console.log("Sending authentication response to the server:", authenticationResponse);

      const response = await axiosInstance.post('/webauthn/login/response/', authenticationResponse);

       // Assuming your backend returns a token upon successful authentication
      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Save the token for future requests
        // Optionally navigate the user to another page or set user context state here
      }

      return response.data;  // Returning the response from the server
    } catch (e) {
      console.error("Authentication error:", e);
      setError(e);
    }
  };

  // Helper function to convert Base64URL to Uint8Array
  const base64urlToUint8Array = (base64url) => {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const raw = window.atob(base64);
    const rawLength = raw.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));
    for (let i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  };

  // Helper function to convert ArrayBuffer to Base64URL
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = window.btoa(binary);
    return base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  };

  return { initiateWebAuthnAuthentication, error };
};

export default useWebAuthnAuthentication;
