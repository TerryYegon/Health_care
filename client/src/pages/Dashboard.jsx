// src/pages/Dashboard.jsx - FINAL VERSION

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentsAPI, doctorsAPI, patientsAPI } from '../api'; 
import { format } from 'date-fns';
import './Dashboard.css';

// Admin helper components to handle selection/actions (simplified for chat)
const DoctorSelect = ({ appointmentId, doctors, currentDoctorId, onAssign }) => {
    const [selectedDoctor, setSelectedDoctor] = useState(currentDoctorId || '');

    const handleAssign = () => {
        if (selectedDoctor) {
            onAssign(appointmentId, parseInt(selectedDoctor));
        }
    };

    return (
        <div className="admin-actions">
            <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                disabled={currentDoctorId !== null} 
            >
                <option value="">{currentDoctorId ? 'Assigned' : 'Assign Doctor'}</option>
                {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>Dr. {doc.name} ({doc.specialization})</option>
                ))}
            </select>
            <button 
                onClick={handleAssign} 
                disabled={!selectedDoctor || currentDoctorId !== null}
                className="assign-btn"
            >
                {currentDoctorId ? 'Assigned' : 'Assign'}
            </button>
        </div>
    );
};

// Custom Confirmation Modal (replaces window.confirm)
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-actions">
                    <button onClick={onConfirm} className="confirm-btn">Confirm</button>
                    <button onClick={onCancel} className="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
};


const Dashboard = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]); 
    const [patients, setPatients] = useState([]); // <<< ADDED PATIENTS STATE
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Modal state
    const [apptToDelete, setApptToDelete] = useState(null); // ID of appointment to delete

    const fetchData = useCallback(async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            const fetchedAppointments = await appointmentsAPI.getAll();
            const fetchedDoctors = await doctorsAPI.getAll();
            const fetchedPatients = await patientsAPI.getAll(); // <<< FETCH PATIENT DATA
            setAppointments(fetchedAppointments);
            setDoctors(fetchedDoctors);
            setPatients(fetchedPatients); // <<< SET PATIENT DATA
        } catch (err) {
            setError('Failed to fetch dashboard data.');
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);


    const handleUpdateStatus = async (id, status) => {
        try {
            const updatedAppt = await appointmentsAPI.updateStatus(id, status); 
            setAppointments(prev => prev.map(app => 
                app.id === id ? { ...app, status: updatedAppt.status } : app
            ));
        } catch (err) {
            setError('Failed to update appointment status.');
            console.error('Error updating appointment:', err);
        }
    };

    const handleAssignDoctor = async (appointmentId, doctorId) => {
        try {
            const updatedAppt = await appointmentsAPI.assignDoctor(appointmentId, doctorId); 
            setAppointments(prev => prev.map(app => 
                app.id === appointmentId ? { 
                    ...app, 
                    doctor_id: updatedAppt.doctor_id, 
                    status: updatedAppt.status
                } : app
            ));
        } catch (err) {
            setError('Failed to assign doctor.');
            console.error('Error assigning doctor:', err);
        }
    };
    
    // --- UPDATED DELETE HANDLER ---
    const handleDeleteAppointment = (id) => {
        setApptToDelete(id);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        setShowConfirmModal(false);
        try {
            await appointmentsAPI.delete(apptToDelete);
            setAppointments(prev => prev.filter(app => app.id !== apptToDelete));
        } catch (err) {
            setError('Failed to delete appointment.');
            console.error('Error deleting appointment:', err);
        } finally {
            setApptToDelete(null);
        }
    };

    const cancelDelete = () => {
        setShowConfirmModal(false);
        setApptToDelete(null);
    };

    if (!user) {
        return <div className="dashboard-container">Please log in to view the dashboard.</div>;
    }

    if (loading) {
        return <div className="dashboard-container">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="dashboard-container error">Error: {error}</div>;
    }

    const today = format(new Date(), 'yyyy-MM-dd');

    // Helper functions to get names from IDs
    const getDoctorName = (doctorId) => {
        const doc = doctors.find(d => d.id === doctorId);
        return doc ? `Dr. ${doc.name}` : 'Unassigned';
    };

    const getPatientName = (patientId) => {
        const patient = patients.find(p => p.id === patientId);
        return patient ? patient.name : `Patient ID: ${patientId}`;
    };


    // ----------------------------------------------------
    // PATIENT DASHBOARD
    // ----------------------------------------------------
    const renderPatientDashboard = () => {
        const patientAppointments = appointments.filter(app => app.patient_id === user.id);
        const upcomingAppointments = patientAppointments.filter(app => app.date >= today && app.status !== 'complete' && app.status !== 'cancelled');
        const pastAppointments = patientAppointments.filter(app => app.date < today || app.status === 'complete' || app.status === 'cancelled');

        return (
            <div className="dashboard-content">
                <h2 className="dashboard-subtitle">Welcome, {user.username || 'Patient'}!</h2>
                <h3 className="section-title">Your Appointments</h3>
                {upcomingAppointments.length > 0 ? (
                    <div className="appointment-list">
                        {upcomingAppointments.map(app => (
                            <div key={app.id} className="appointment-item">
                                <p><strong>Doctor:</strong> {getDoctorName(app.doctor_id)}</p>
                                <p><strong>Date:</strong> {format(new Date(app.date), 'MMMM d, yyyy')}</p>
                                <p><strong>Time:</strong> {app.time}</p>
                                <span className={`appointment-status status-${app.status}`}>{app.status}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>You have no upcoming appointments. Please visit the Home page to book.</p>
                )}
            </div>
        );
    };

    // ----------------------------------------------------
    // DOCTOR DASHBOARD
    // ----------------------------------------------------
    const renderDoctorDashboard = () => {
        const doctorAppointments = appointments.filter(app => app.doctor_id === user.id);
        const upcomingAppointments = doctorAppointments.filter(app => app.status !== 'complete' && app.status !== 'cancelled');
        const completedAppointments = doctorAppointments.filter(app => app.status === 'complete');

        return (
            <div className="dashboard-content">
                <h2 className="dashboard-subtitle">Dr. {user.username || 'Doctor'}, your schedule.</h2>

                <h3 className="section-title">Upcoming Patient Appointments</h3>
                {upcomingAppointments.length > 0 ? (
                    <div className="appointment-list">
                        {upcomingAppointments.map(app => (
                            <div key={app.id} className="appointment-item">
                                <p><strong>Patient:</strong> {getPatientName(app.patient_id)}</p>
                                <p><strong>Date:</strong> {format(new Date(app.date), 'MMMM d, yyyy')}</p>
                                <p><strong>Time:</strong> {app.time}</p>
                                <div className="appointment-actions">
                                    <button className="complete-btn" onClick={() => handleUpdateStatus(app.id, 'complete')}>Complete</button>
                                    <button className="cancel-btn" onClick={() => handleUpdateStatus(app.id, 'cancelled')}>Cancel</button>
                                    <span className={`appointment-status status-${app.status}`}>{app.status}</span>
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

    // ----------------------------------------------------
    // ADMIN DASHBOARD
    // ----------------------------------------------------
    const renderAdminDashboard = () => {
        const pendingAppointments = appointments.filter(app => !app.doctor_id || app.status === 'scheduled');
        const allAppointments = [...appointments].sort((a, b) => new Date(a.date) - new Date(b.date));

        return (
            <div className="dashboard-content">
                <h2 className="dashboard-subtitle">Admin Appointment Management</h2>
                
                <h3 className="section-title">Pending Appointments ({pendingAppointments.length})</h3>
                {pendingAppointments.length > 0 ? (
                    <div className="appointment-table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date/Time</th>
                                    <th>Patient</th>
                                    <th>Current Doctor</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingAppointments.map(app => (
                                    <tr key={app.id} className={`status-${app.status}`}>
                                        <td>{app.id}</td>
                                        <td>{app.date} @ {app.time}</td>
                                        <td>{getPatientName(app.patient_id)}</td>
                                        <td>
                                            <DoctorSelect 
                                                appointmentId={app.id}
                                                doctors={doctors}
                                                currentDoctorId={app.doctor_id}
                                                onAssign={handleAssignDoctor}
                                            />
                                        </td>
                                        <td><span className={`appointment-status status-${app.status}`}>{app.status}</span></td>
                                        <td>
                                            <button 
                                                onClick={() => handleUpdateStatus(app.id, 'confirmed')}
                                                disabled={app.status !== 'scheduled'}
                                                className="action-btn"
                                            >
                                                Confirm
                                            </button>
                                        </td>
                                        <td>
                                            <button onClick={() => handleDeleteAppointment(app.id)} className="delete-btn">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No pending appointments requiring action.</p>
                )}
                <h3 className="section-title">All Appointments ({allAppointments.length})</h3>
                <div className="appointment-table-container all-appointments">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date/Time</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allAppointments.map(app => (
                                <tr key={app.id} className={`status-${app.status}`}>
                                    <td>{app.id}</td>
                                    <td>{app.date} @ {app.time}</td>
                                    <td>{getPatientName(app.patient_id)}</td>
                                    <td>{getDoctorName(app.doctor_id)}</td>
                                    <td><span className={`appointment-status status-${app.status}`}>{app.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // ----------------------------------------------------
    // MAIN RENDER SWITCH
    // ----------------------------------------------------
    return (
        <div className="dashboard-container">
            {showConfirmModal && (
                <ConfirmationModal 
                    message="Are you sure you want to delete this appointment?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
            {user.role === 'patient' && renderPatientDashboard()}
            {user.role === 'doctor' && renderDoctorDashboard()}
            {user.role === 'clinic_admin' && renderAdminDashboard()}
        </div>
    );
};

export default Dashboard;
