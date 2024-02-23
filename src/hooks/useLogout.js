// src/hooks/useLogout.js
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

const useLogout = (onSuccessLogout) => {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await axiosInstance.post('/logout/');
            console.log('Logged out successfully');
            localStorage.removeItem('token'); // Clear the token
            onSuccessLogout(); // Update isLoggedIn state
            navigate('/'); // Navigate to welcome page
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return logout;
};


export default useLogout;
