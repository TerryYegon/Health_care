// src/pages/AdminDoctors.jsx

import React, { useState, useEffect } from 'react';
import { usersAPI, authAPI } from '../api'; // NOW IMPORTING authAPI
import './AdminDoctors.css';
import { PlusCircle, Edit, Trash2, X, AlertTriangle } from "lucide-react"

// List of demo emails to protect from deletion
const PROTECTED_DEMO_EMAILS = [
    'patient@example.com', 
    'doctor@example.com', 
    'admin@example.com'
];

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDoctor, setCurrentDoctor] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'doctor' });

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            // This API call fetches all users, including the non-doctors created via registration
            const allUsers = await usersAPI.getAll(); 
            // Filter out patients and the admin account itself from the doctor list
            const doctorList = allUsers.filter(user => user.role === 'doctor');
            setDoctors(doctorList);
        } catch (err) {
            setError('Failed to fetch doctor list. Ensure backend is running.');
            console.error('Error fetching doctors:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (doctor = null) => {
        setCurrentDoctor(doctor);
        if (doctor) {
            setFormData({ name: doctor.name, email: doctor.email, password: '', role: 'doctor' });
        } else {
            setFormData({ name: '', email: '', password: '', role: 'doctor' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentDoctor(null);
        setError(''); 
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // CREATE and UPDATE logic
    const handleSaveDoctor = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (currentDoctor) {
                // UPDATE
                if (PROTECTED_DEMO_EMAILS.includes(currentDoctor.email)) {
                    setError('Cannot edit core demo accounts.');
                    return;
                }
                
                const updateData = { name: formData.name, email: formData.email };
                if (formData.password) {
                    updateData.password = formData.password;
                }
                await usersAPI.update(currentDoctor.id, updateData);
                alert('Doctor updated successfully!');
            } else {
                // CREATE - Correctly using authAPI.register
                if (!formData.name || !formData.email || !formData.password) {
                    setError('Please fill all required fields.');
                    return;
                }
                await authAPI.register(formData); // FIX APPLIED HERE
                alert('Doctor added successfully!');
            }
            fetchDoctors(); 
            handleCloseModal();
        } catch (err) {
            setError(err.message || `Failed to ${currentDoctor ? 'update' : 'add'} doctor.`);
        }
    };

    // DELETE logic
    const handleDeleteDoctor = async (id, email) => {
        if (PROTECTED_DEMO_EMAILS.includes(email)) {
            alert('Cannot delete core demo accounts.');
            return;
        }

        if (!window.confirm("Are you sure you want to delete this doctor?")) return;
        
        try {
            await usersAPI.delete(id);
            alert('Doctor deleted successfully!');
            fetchDoctors(); 
        } catch (err) {
            setError(err.message || 'Failed to delete doctor.');
        }
    };

    if (loading) return <div className="admin-container">Loading doctor management panel...</div>;

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1 className="admin-title">Manage Doctors</h1>
                <button 
                    className="add-btn" 
                    onClick={() => handleOpenModal()}
                >
                    <PlusCircle size={20} /> Add New Doctor
                </button>
            </div>
            
            {error && <div className="error-message">{error}</div>}

            <div className="doctor-list-table-container">
                <table className="doctor-list-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctors.map(doctor => {
                            const isProtected = PROTECTED_DEMO_EMAILS.includes(doctor.email);
                            return (
                                <tr key={doctor.id}>
                                    <td>{doctor.name} {isProtected && <AlertTriangle size={16} color="#f59e0b" title="Demo Account" />}</td>
                                    <td>{doctor.email}</td>
                                    <td className="action-buttons">
                                        <button 
                                            className="edit-btn" 
                                            onClick={() => handleOpenModal(doctor)}
                                            disabled={isProtected}
                                            title={isProtected ? "Cannot edit demo account" : "Edit Doctor"}
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button 
                                            className="delete-btn" 
                                            onClick={() => handleDeleteDoctor(doctor.id, doctor.email)}
                                            disabled={isProtected}
                                            title={isProtected ? "Cannot delete demo account" : "Delete Doctor"}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            
            {doctors.length === 0 && <p className="no-data-message">No doctors found. Click 'Add New Doctor' to begin.</p>}

            {/* Modal for Create/Update */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3 className="modal-title">{currentDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h3>
                            <button className="close-btn" onClick={handleCloseModal}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSaveDoctor} className="modal-form">
                            {error && <div className="error-message-modal">{error}</div>}
                            <div className="form-group">
                                <label>Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleFormChange} required />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleFormChange} required />
                            </div>
                            <div className="form-group">
                                <label>{currentDoctor ? 'New Password (Optional)' : 'Password'}</label>
                                <input type="password" name="password" value={formData.password} onChange={handleFormChange} required={!currentDoctor} />
                            </div>
                            <button type="submit" className="modal-save-btn">
                                {currentDoctor ? 'Save Changes' : 'Add Doctor'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDoctors;