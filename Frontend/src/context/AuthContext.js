import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [deviceId, setDeviceId] = useState(null);

    useEffect(() => {
        const initFingerprint = async () => {
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            setDeviceId(result.visitorId);
        };
        initFingerprint();

        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        // Restore session if token and user data are present
        if (storedUser && token) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (err) {
                console.error("Failed to parse stored user", err);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/login', { 
                email, 
                password, 
                deviceId 
            });

            // Set user state and local storage
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            
            // Save the token separately for cleaner API header access
            if (data.token) {
                localStorage.setItem('token', data.token);
            }

            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // Optional: clear any other session-specific data
    };

    const register = async (userData) => {
        try {
            const { data } = await axios.post('http://localhost:5000/api/auth/register', userData);
            setUser(data);
            localStorage.setItem('user', JSON.stringify(data));
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Registration failed' 
            };
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, deviceId, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);