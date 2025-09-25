// src/pages/Appointments.jsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentsAPI } from '../api';
import { format } from 'date-fns';
import './Appointments.css';

const Appointments = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setLoading(true);
                const fetchedAppointments = await appointmentsAPI.getAll();
                let filteredAppointments = [];

                if (user.role === 'patient') {
                    filteredAppointments = fetchedAppointments.filter(app => app.patient_id === user.id);
                } else if (user.role === 'doctor') {
                    filteredAppointments = fetchedAppointments.filter(app => app.doctor_id === user.id);
                } else if (user.role === 'clinic_admin') {
                    filteredAppointments = fetchedAppointments;
                }

                setAppointments(filteredAppointments.sort((a, b) => new Date(a.date) - new Date(b.date)));
            } catch (err) {
                setError('Failed to fetch appointments. Please try again.');
                console.error('Error fetching appointments:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchAppointments();
        }
    }, [user]);

    const handleUpdateStatus = async (id, newStatus) => {
        if (user.role !== 'doctor') return;
        
        const confirmation = window.confirm(`Are you sure you want to change the status of this appointment to '${newStatus}'?`);
        if (!confirmation) {
            return;
        }

        try {
            await appointmentsAPI.update(id, { status: newStatus });
            setAppointments(prev => prev.map(app => 
                app.id === id ? { ...app, status: newStatus } : app
            ));
        } catch (err) {
            setError('Failed to update appointment status.');
            console.error('Error updating status:', err);
        }
    };

    if (!user) {
        return <div className="appointments-container">Please log in to view appointments.</div>;
    }

    if (loading) {
        return <div className="appointments-container">Loading appointments...</div>;
    }

    const title = user.role === 'patient' ? "My Appointments" : "Patient Appointments";
    const showActions = user.role === 'doctor';
    
    return (
        <div className="appointments-container">
            <h1 className="appointments-title">{title}</h1>
            {error && <div className="error-message">{error}</div>}
            
            {appointments.length === 0 ? (
                <div className="no-appointments">
                    <p>No appointments found.</p>
                </div>
            ) : (
                <div className="appointments-grid">
                    {appointments.map(app => (
                        <div key={app.id} className="appointment-card">
                            {user.role === 'patient' && (
                                <div className="card-info">
                                    <h3>Doctor: {app.doctor_name}</h3>
                                    <p>Clinic: {app.clinic_name}</p>
                                </div>
                            )}
                            {user.role === 'doctor' && (
                                <div className="card-info">
                                    <h3>Patient: {app.patient_name}</h3>
                                    <p>Clinic: {app.clinic_name}</p>
                                </div>
                            )}
                            <div className="card-details">
                                <p><strong>Date:</strong> {format(new Date(app.date), 'MMMM d, yyyy')}</p>
                                <p><strong>Time:</strong> {app.time}</p>
                                {app.notes && <p className="notes"><strong>Notes:</strong> {app.notes}</p>}
                            </div>
                            <div className="card-status">
                                <span className={`status-badge status-${app.status}`}>{app.status}</span>
                            </div>
                            {showActions && app.status === 'scheduled' && (
                                <div className="card-actions">
                                    <button 
                                        className="btn-complete" 
                                        onClick={() => handleUpdateStatus(app.id, 'completed')}
                                    >
                                        Complete
                                    </button>
                                    <button 
                                        className="btn-cancel" 
                                        onClick={() => handleUpdateStatus(app.id, 'cancelled')}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Appointments;