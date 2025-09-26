import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, [user]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/appointments');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      showMessage('Error loading appointments');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/doctors');
      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleAssignDoctor = async (appointmentId, doctorId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Role': 'admin'
        },
        body: JSON.stringify({ doctor_id: doctorId })
      });
      
      if (response.ok) {
        showMessage('Doctor assigned successfully!');
        fetchAppointments();
      } else {
        showMessage('Error assigning doctor');
      }
    } catch (error) {
      console.error('Error assigning doctor:', error);
      showMessage('Error assigning doctor');
    }
  };

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Role': 'doctor'
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        showMessage(`Appointment ${status} successfully!`);
        await fetchAppointments();
      } else {
        showMessage('Error updating status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      showMessage('Error updating status');
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/appointments/${appointmentId}`, {
          method: 'DELETE',
          headers: { 'Role': 'admin' }
        });
        
        if (response.ok) {
          showMessage('Appointment deleted successfully!');
          fetchAppointments();
        } else {
          showMessage('Error deleting appointment');
        }
      } catch (error) {
        console.error('Error deleting appointment:', error);
        showMessage('Error deleting appointment');
      }
    }
  };

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="error-message">Please log in to access the dashboard.</div>
      </div>
    );
  }

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  const userAppointments = appointments.filter(appt => {
    if (user.role === 'doctor') return appt.doctor_id === user.id;
    if (user.role === 'admin') return true;
    return appt.patient_id === user.id;
  });

  return (
    <div className="dashboard-container" style={{ marginTop: '80px' }}>
      <div className="dashboard-header">
        <h1>Dashboard - {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {user.role === 'admin' && (
        <div className="admin-section">
          <h2>Pending Appointments</h2>
          {userAppointments.filter(a => a.status === 'pending').map(appt => (
            <div key={appt.id} className="appointment-card">
              <p>Patient ID: {appt.patient_id} | Date: {appt.date} {appt.time} | Reason: {appt.reason}</p>
              <select onChange={(e) => handleAssignDoctor(appt.id, e.target.value)}>
                <option value="">Assign Doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
              <button 
                onClick={() => handleDeleteAppointment(appt.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {user.role === 'doctor' && (
        <div className="doctor-section">
          <h2>My Appointments</h2>
          {userAppointments.map(appt => (
            <div key={appt.id} className="appointment-card">
              <p>Appointment ID: {appt.id} | Date: {appt.date} {appt.time}</p>
              <p>Status: {appt.status} | Reason: {appt.reason}</p>
              <div className="status-buttons">
                <button onClick={() => handleUpdateStatus(appt.id, 'confirmed')}>
                  Confirm
                </button>
                <button onClick={() => handleUpdateStatus(appt.id, 'completed')}>
                  Complete
                </button>
                <button onClick={() => handleUpdateStatus(appt.id, 'cancelled')}>
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {user.role === 'patient' && (
        <div className="patient-section">
          <h2>My Appointments</h2>
          {userAppointments.map(appt => (
            <div key={appt.id} className="appointment-card">
              <p>Appointment ID: {appt.id} | Date: {appt.date} {appt.time}</p>
              <p>Status: {appt.status} | Reason: {appt.reason}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;