// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Hardcoded demo users for easy testing and demonstration
    const demoUsers = {
        'patient@example.com': { id: 1, name: 'Demo Patient', email: 'patient@example.com', role: 'patient' },
        'doctor@example.com': { id: 2, name: 'Demo Doctor', email: 'doctor@example.com', role: 'doctor' },
        'admin@example.com': { id: 3, name: 'Demo Admin', email: 'admin@example.com', role: 'clinic_admin' },
    };

    useEffect(() => {
        const loadUser = () => {
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
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        // Simulate a network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (demoUsers[email] && password === 'password123') {
            const userData = demoUsers[email];
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            setLoading(false);
            return userData;
        } else {
            setLoading(false);
            throw new Error('Invalid email or password. Please use the demo accounts.');
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};