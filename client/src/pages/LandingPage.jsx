import React, { useState } from 'react';
import { Search, Calendar, MessageCircle, Heart, Activity, Pill, Star } from 'lucide-react';
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

import './LandingPage.css';

const LandingPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    doctor: '',
    description: '',
    phone: '',
  });

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const doctorIdMap = {
      "Dr. Linda - Medicine Specialist": 1,
      "Dr. Alisa - Cardiology Specialist": 2,
      "Dr. Antony - Neurology Specialist": 3,
      "Dr. Khalid - Cancer Specialist": 4,
    };
    const doctor_id = doctorIdMap[formData.doctor];

    try {
      // Step 1: Create patient
      const patientRes = await fetch('http://127.0.0.1:5000/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Role': 'admin' },
        body: JSON.stringify({ name: formData.name, age: 0 }),
      });
      const patientData = await patientRes.json();

      // Step 2: Create appointment
      await fetch('http://127.0.0.1:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Role': 'admin' },
        body: JSON.stringify({
          patient_id: patientData.id,
          doctor_id,
          date: "2025-10-10",
          time: "10:00",
          description: formData.description,
          phone: formData.phone,
        }),
      });

      alert("Appointment booked successfully!");
      setFormData({ name: '', doctor: '', description: '', phone: '' });
      closeForm();
    } catch (error) {
      console.error(error);
      alert("Error booking appointment.");
    }
  };

  return (
    <div className="landing-page">
      {/* NavBar */}
      <NavBar openForm={openForm} />

      {/* Booking Form Modal */}
      {isFormOpen && (
        <div className="form-modal">
          <div className="form-modal-content">
            <button className="close-btn" onClick={closeForm}>X</button>
            <h2>Book Appointment</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Name:
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </label>

              <label>
                Choose Doctor:
                <select name="doctor" value={formData.doctor} onChange={handleChange} required>
                  <option value="">Select a Doctor</option>
                  <option value="Dr. Linda - Medicine Specialist">Dr. Linda - Medicine Specialist</option>
                  <option value="Dr. Alisa - Cardiology Specialist">Dr. Alisa - Cardiology Specialist</option>
                  <option value="Dr. Antony - Neurology Specialist">Dr. Antony - Neurology Specialist</option>
                  <option value="Dr. Khalid - Cancer Specialist">Dr. Khalid - Cancer Specialist</option>
                </select>
              </label>

              <label>
                Describe Your Symptoms:
                <textarea name="description" value={formData.description} onChange={handleChange} required />
              </label>

              <label>
                Phone Number:
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
              </label>

              <button type="submit" className="btn-primary">Submit</button>
            </form>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-grid container">
          <div className="hero-content">
            <h1 className="hero-title">
              Find And Search Your
              <span className="hero-title-accent"> Suitable Doctor's</span>
            </h1>
            <p className="hero-description">
              Join us and take care of yourself and your family with health services 
              that will make you feel confident and safe in your daily life.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={openForm}>Find A Doctor</button>
            </div>
          </div>

          <div className="hero-image">
            <div className="image-card">
              <div className="image-content">
                <img src="/doctor2.jpeg" alt="Doctor" className="hero-real-image" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="steps-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">3 Easy Steps and Get Your Solution</h2>
          </div>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-icon blue">
                <Search size={40} />
              </div>
              <h3 className="step-title">Find Best Doctors</h3>
              <p className="step-description">
                Find your doctor easily with a minimum of effort. We've kept everything organised for you.
              </p>
            </div>
            
            <div className="step-card">
              <div className="step-icon green">
                <Calendar size={40} />
              </div>
              <h3 className="step-title">Get Appointment</h3>
              <p className="step-description">
                Ask for an appointment of the doctor quickly with almost a single click. We take care of the rest.
              </p>
            </div>
            
            <div className="step-card">
              <div className="step-icon purple">
                <MessageCircle size={40} />
              </div>
              <h3 className="step-title">Happy Consultations</h3>
              <p className="step-description">
                Do consultations and take the service based on your appointment. Get back to good health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Section */}
      <section className="quality-section">
        <div className="container">
          <div className="quality-grid">
            <div className="quality-image">
              <div className="quality-card">
                <div className="quality-content">
                  <img src="/doctor1.jpeg" alt="Quality healthcare service" className="quality-real-image" />
                </div>
              </div>
            </div>

            <div className="quality-text">
              <h2 className="quality-title">
                Best quality service with our experienced doctors
              </h2>
              <p className="quality-description">
                With our top doctors, we are able to provide best medical services above average. 
                We have highly experienced doctors, so don't worry. They are also very talented in their fields.
              </p>
              <ul className="quality-list">
                <li>Search your specialist & Online consultations anywhere</li>
                <li>Consultation our top specialists</li>
                <li>Doctors are available 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Services</h2>
            <p className="section-description">
              Our doctors have high qualified skills and are guaranteed to help you recover from your disease.
            </p>
          </div>
          
          <div className="services-grid">
            <div className="service-card red">
              <div className="service-icon">
                <Heart size={32} />
              </div>
              <h3 className="service-title">Cardiology</h3>
              <p className="service-description">
                Our cardiologists are skilled at diagnosing and treating diseases of the cardiovascular system.
              </p>
            </div>
            
            <div className="service-card blue">
              <div className="service-icon">
                <Activity size={32} />
              </div>
              <h3 className="service-title">Pulmonology</h3>
              <p className="service-description">
                Our Pulmonologists are skilled at diagnosing and treating diseases of the respiratory system.
              </p>
            </div>
            
            <div className="service-card green">
              <div className="service-icon">
                <Pill size={32} />
              </div>
              <h3 className="service-title">Medicine</h3>
              <p className="service-description">
                Our medicine doctors are skilled at diagnosing and treating diseases with the latest medicine systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="doctors-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Meet Our Certified Online Doctors</h2>
            <p className="section-description">
              Our online doctors have an average of 15 years experience and a 98% satisfaction rating, 
              they really set us apart!
            </p>
          </div>
          
          <div className="doctors-grid">
            {[
              { name: "Dr. Linda", specialty: "Medicine Specialist", rating: 4.9, color: "blue" },
              { name: "Dr. Alisa", specialty: "Cardiology Specialist", rating: 4.8, color: "red" },
              { name: "Dr. Antony", specialty: "Neurology Specialist", rating: 4.9, color: "purple" },
              { name: "Dr. Khalid", specialty: "Cancer Specialist", rating: 4.7, color: "green" }
            ].map((doctor, index) => (
              <div key={index} className="doctor-card">
                <div className={`doctor-avatar ${doctor.color}`}>
                  {doctor.name.split('.')[1][0]}
                </div>
                <h3 className="doctor-name">{doctor.name}</h3>
                <p className="doctor-specialty">{doctor.specialty}</p>
                <div className="doctor-rating">
                  <Star size={16} />
                  <span>{doctor.rating}</span>
                </div>
                <button className="doctor-btn" onClick={openForm}>Book Now</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">It's Time... Change Your Life</h2>
            <p className="cta-description">
              Start your journey to better health today with our expert medical team and 
              cutting-edge technology.
            </p>
            <button className="cta-btn" onClick={openForm}>Get Started Now</button>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default LandingPage;
