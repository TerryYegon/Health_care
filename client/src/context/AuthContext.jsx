// src/context/AuthContext.jsx - SIMPLIFIED VERSION

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    // The user state will hold the user object with role and other info
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load initial user state from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from localStorage", e);
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    // The simplified login function takes a user object directly
    const login = async (user) => {
        // In the real app, this would use the authAPI to get the user from the backend
        // For this simplified version, we just save the provided user object
        try {
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            // No token is needed since we're not making authenticated API calls
        } catch (e) {
            console.error("Login failed:", e);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    const value = {
        user,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
