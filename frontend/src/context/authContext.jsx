import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
// 1. Import useNavigate
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // 2. Initialize navigate hook
    const navigate = useNavigate();

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const response = await axios.get(`${API_BASE_URL}/api/auth/verify`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (response.data.success) {
                        setUser(response.data.user);
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                if (error.response && !error.response.data.success) {
                    setError(error.response.data.message);
                    setUser(null);
                } else {
                    setError("Server Error: Please try again later.");
                }
            } finally {
                setLoading(false);
            }
        };

        verifyUser();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("token");
        // 3. This will now work
        navigate('/login');
    };

    return (
        <UserContext.Provider value={{ user, login, logout, error, loading }}>
            {children}
        </UserContext.Provider>
    );
};

export const useAuth = () => useContext(UserContext);

export default AuthContextProvider;