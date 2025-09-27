// src/pages/Doctors.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { clinicsAPI, appointmentsAPI } from '../api';
import { useNavigate } from 'react-router-dom';
import './Doctors.css';

export default function Doctors() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClinicId, setSelectedClinicId] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({ date: '', time: '', notes: '' });

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    try {
      setLoading(true);
      const data = await clinicsAPI.getAll();
      setClinics(data || []);
    } catch (err) {
      setError('Failed to load clinics and doctors');
      console.error('Error fetching clinics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = (doctor) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'patient') {
      alert('Only patients can book appointments.');
      return;
    }
    setSelectedDoctor(doctor);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await appointmentsAPI.create({
        doctor_id: selectedDoctor.id,
        clinic_id: selectedDoctor.clinicId,
        date: bookingData.date,
        time: bookingData.time,
        notes: bookingData.notes
      });
      alert('Appointment booked successfully!');
      setShowBookingForm(false);
      setBookingData({ date: '', time: '', notes: '' });
    } catch (err) {
      alert('Failed to book appointment: ' + err.message);
      console.error('Booking error:', err);
    }
  };

  const allDoctors = clinics.flatMap(clinic =>
    (clinic.doctors || []).map(doctor => ({
      ...doctor,
      clinicName: clinic.name,
      clinicId: clinic.id
    }))
  );

  const filteredDoctors = allDoctors.filter(doctor =>
    !selectedClinicId || doctor.clinicId === parseInt(selectedClinicId, 10)
  );

  return (
    <>
      <div className="doctors-page-container">
        <div className="doctors-header">
          <h1 className="doctors-title">Our Doctors</h1>
          <p className="doctors-description">Meet our team of healthcare professionals across all clinics</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loading-message">Loading doctors...</div>
        ) : (
          <>
            {/* Clinic Filter */}
            <div className="filter-container">
              <select
                className="clinic-filter-select"
                value={selectedClinicId}
                onChange={(e) => setSelectedClinicId(e.target.value)}
              >
                <option value="">All Clinics</option>
                {clinics.map(clinic => <option key={clinic.id} value={clinic.id}>{clinic.name}</option>)}
              </select>
            </div>

            {/* Doctors Grid */}
            <div className="doctors-grid-container">
              {filteredDoctors.map(doctor => (
                <div key={`${doctor.id}-${doctor.clinicId}`} className="doctor-card-doctors-page">
                  <div className="doctor-avatar-doctors-page">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="doctor-name-doctors-page">{doctor.name}</h3>
                  <p className="doctor-specialty-doctors-page">Medical Professional</p>
                  <p className="doctor-clinic-name">{doctor.clinicName}</p>
                  <button
                    onClick={() => handleBookAppointment(doctor, doctor.clinicId)}
                    className="book-btn"
                  >
                    {user?.role === 'patient' ? 'Book Appointment' : 'View Details'}
                  </button>
                </div>
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <div className="no-doctors-found">
                <h3>No doctors found</h3>
                <p>No doctors available for the selected clinic.</p>
              </div>
            )}
          </>
        )}

        {/* Booking Modal */}
        {showBookingForm && selectedDoctor && (
          <div className="booking-modal-overlay">
            <div className="booking-modal-content">
              <h3 className="booking-modal-title">Book Appointment with {selectedDoctor.name}</h3>
              <form onSubmit={handleBookingSubmit}>
                <div className="form-group">
                  <label>Date:</label>
                  <input type="date" required value={bookingData.date} onChange={(e) => setBookingData({...bookingData, date: e.target.value})} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Time:</label>
                  <input type="time" required value={bookingData.time} onChange={(e) => setBookingData({...bookingData, time: e.target.value})} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Notes (Optional):</label>
                  <textarea value={bookingData.notes} onChange={(e) => setBookingData({...bookingData, notes: e.target.value})} className="form-textarea" />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="modal-submit-btn">Book Appointment</button>
                  <button type="button" onClick={() => setShowBookingForm(false)} className="modal-cancel-btn">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}