// src/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentsAPI, usersAPI } from '../api';
import { format } from 'date-fns';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [allUsers, setAllUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const fetchedAppointments = await appointmentsAPI.getAll();
                setAppointments(fetchedAppointments);
                
                if (user.role === 'clinic_admin') {
                    const fetchedUsers = await usersAPI.getAll();
                    setAllUsers(fetchedUsers);
                }
            } catch (err) {
                setError('Failed to fetch data.');
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    const handleUpdateAppointment = async (id, status) => {
        try {
            await appointmentsAPI.update(id, { status });
            setAppointments(prev => prev.map(app => 
                app.id === id ? { ...app, status } : app
            ));
        } catch (err) {
            setError('Failed to update appointment status.');
            console.error('Error updating appointment:', err);
        }
    };

    if (!user) {
        return <div className="dashboard-container">Please log in to view the dashboard.</div>;
    }

    if (loading) {
        return <div className="dashboard-container">Loading dashboard...</div>;
    }

    const today = format(new Date(), 'yyyy-MM-dd');

    const renderPatientDashboard = () => {
        const patientAppointments = appointments.filter(app => app.patient_id === user.id);
        const upcomingAppointments = patientAppointments.filter(app => app.status === 'scheduled' && app.date >= today);
        const pastAppointments = patientAppointments.filter(app => app.status !== 'scheduled' || app.date < today);

        return (
            <div className="dashboard-content">
                <h2 className="dashboard-subtitle">Welcome, {user.name}!</h2>
                <div className="card-container">
                    <div className="dashboard-card primary-card">
                        <h3>Upcoming Appointments</h3>
                        <p>{upcomingAppointments.length}</p>
                    </div>
                    <div className="dashboard-card">
                        <h3>Past Appointments</h3>
                        <p>{pastAppointments.length}</p>
                    </div>
                </div>
                
                <h3 className="section-title">Your Appointments</h3>
                {upcomingAppointments.length > 0 ? (
                    <div className="appointment-list">
                        {upcomingAppointments.map(app => (
                            <div key={app.id} className="appointment-item">
                                <p><strong>Doctor:</strong> {app.doctor_name}</p>
                                <p><strong>Clinic:</strong> {app.clinic_name}</p>
                                <p><strong>Date:</strong> {format(new Date(app.date), 'MMMM d, yyyy')}</p>
                                <p><strong>Time:</strong> {app.time}</p>
                                <span className={`appointment-status status-${app.status}`}>{app.status}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You have no upcoming appointments.</p>
                )}
            </div>
        );
    };

    const renderDoctorDashboard = () => {
        const doctorAppointments = appointments.filter(app => app.doctor_id === user.id);
        const upcomingAppointments = doctorAppointments.filter(app => app.status === 'scheduled' && app.date >= today);
        const completedAppointments = doctorAppointments.filter(app => app.status === 'completed');

        return (
            <div className="dashboard-content">
                <h2 className="dashboard-subtitle">Dr. {user.name}, your day is ready.</h2>
                <div className="card-container">
                    <div className="dashboard-card primary-card">
                        <h3>Today's Appointments</h3>
                        <p>{upcomingAppointments.filter(app => app.date === today).length}</p>
                    </div>
                    <div className="dashboard-card">
                        <h3>Upcoming Total</h3>
                        <p>{upcomingAppointments.length}</p>
                    </div>
                    <div className="dashboard-card">
                        <h3>Completed</h3>
                        <p>{completedAppointments.length}</p>
                    </div>
                </div>

                <h3 className="section-title">Upcoming Patient Appointments</h3>
                {upcomingAppointments.length > 0 ? (
                    <div className="appointment-list">
                        {upcomingAppointments.map(app => (
                            <div key={app.id} className="appointment-item">
                                <p><strong>Patient:</strong> {app.patient_name}</p>
                                <p><strong>Date:</strong> {format(new Date(app.date), 'MMMM d, yyyy')}</p>
                                <p><strong>Time:</strong> {app.time}</p>
                                <div className="appointment-actions">
                                    <button className="complete-btn" onClick={() => handleUpdateAppointment(app.id, 'completed')}>Complete</button>
                                    <button className="cancel-btn" onClick={() => handleUpdateAppointment(app.id, 'cancelled')}>Cancel</button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You have no upcoming appointments.</p>
                )}
            </div>
        );
    };

    const renderAdminDashboard = () => {
        const totalPatients = allUsers.filter(u => u.role === 'patient').length;
        const totalDoctors = allUsers.filter(u => u.role === 'doctor').length;
        const totalAppointments = appointments.length;

        return (
            <div className="dashboard-content">
                <h2 className="dashboard-subtitle">Admin Dashboard</h2>
                <div className="card-container">
                    <div className="dashboard-card primary-card">
                        <h3>Total Appointments</h3>
                        <p>{totalAppointments}</p>
                    </div>
                    <div className="dashboard-card">
                        <h3>Total Doctors</h3>
                        <p>{totalDoctors}</p>
                    </div>
                    <div className="dashboard-card">
                        <h3>Total Patients</h3>
                        <p>{totalPatients}</p>
                    </div>
                </div>
                
                <h3 className="section-title">Recent Activity</h3>
                <p>Use the navigation to manage doctors, patients, and appointments.</p>
            </div>
        );
    };

    return (
        <div className="dashboard-container">
            {user.role === 'patient' && renderPatientDashboard()}
            {user.role === 'doctor' && renderDoctorDashboard()}
            {user.role === 'clinic_admin' && renderAdminDashboard()}
        </div>
    );
};

export default Dashboard;