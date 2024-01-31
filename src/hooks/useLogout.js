// src/hooks/useLogout.js
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosConfig';

const useLogout = () => {
    const navigate = useNavigate();

    const logout = async () => {
        try {
            // Make a POST request to the logout endpoint without the Authorization header
            await axiosInstance.post('/logout/');

            console.log('Logged out successfully');
            localStorage.removeItem('access_token'); // Clear the token from local storage
            navigate('/'); // Navigate to the root path (Welcome page)
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return logout;
};

export default useLogout;
