// src/components/Login.jsx - SIMPLEST LOGIN

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [role, setRole] = useState('patient'); 
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Bypass the API call and create a mock user object based on the role
            const mockUser = {
                id: 1, 
                role: role, 
                username: role, 
            };
            await login(mockUser); 
        } catch (err) {
            // This part should not be reached in this simplified version
            console.error("Login failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2 className="auth-title">Welcome Back</h2>
                <p className="auth-subtitle">Sign in to your account</p>
                <form onSubmit={handleSubmit} className="auth-form">
                    
                    <div className="form-group">
                        <label htmlFor="role">Login As</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                            <option value="clinic_admin">Admin</option>
                        </select>
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </div>
                
                <div className="demo-credentials">
                    <h3>Simplified Login</h3>
                    <p>Select a role from the dropdown to log in without a password.</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
