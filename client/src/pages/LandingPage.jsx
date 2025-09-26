import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Search, Calendar, MessageCircle, Heart, Activity, Pill, Star } from 'lucide-react';
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import './LandingPage.css';

const LandingPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => {
    setIsFormOpen(false);
    setSubmitMessage('');
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      doctor: '',
      description: '',
      phone: '',
      date: '',
      time: ''
    },
    validate: (values) => {
      const errors = {};
      
      // String validations
      if (!values.name) {
        errors.name = 'Name is required';
      } else if (values.name.length < 2) {
        errors.name = 'Name must be at least 2 characters';
      }

      if (!values.doctor) {
        errors.doctor = 'Please select a doctor';
      }

      if (!values.description) {
        errors.description = 'Description is required';
      } else if (values.description.length < 10) {
        errors.description = 'Description must be at least 10 characters';
      }

      // Phone format validation
      if (!values.phone) {
        errors.phone = 'Phone number is required';
      } else if (!/^\d{10,15}$/.test(values.phone.replace(/\D/g, ''))) {
        errors.phone = 'Please enter a valid phone number';
      }

      // Date validation
      if (!values.date) {
        errors.date = 'Date is required';
      } else {
        const selectedDate = new Date(values.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          errors.date = 'Date cannot be in the past';
        }
      }

      // Time validation
      if (!values.time) {
        errors.time = 'Time is required';
      }

      return errors;
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const doctorIdMap = {
          "Dr. Linda - Medicine Specialist": 1,
          "Dr. Alisa - Cardiology Specialist": 2,
          "Dr. Antony - Neurology Specialist": 3,
          "Dr. Khalid - Cancer Specialist": 4,
        };
        const doctor_id = doctorIdMap[values.doctor];

        // Create patient
        const patientRes = await fetch('http://127.0.0.1:5000/api/patients', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Role': 'admin'  // ADDED THIS LINE TO FIX 403 ERROR
          },
          body: JSON.stringify({ 
            name: values.name, 
            age: 30,
            contact: values.phone
          }),
        });
        
        if (!patientRes.ok) {
          throw new Error('Failed to create patient');
        }
        
        const patientData = await patientRes.json();

        // Create appointment
        const appointmentRes = await fetch('http://127.0.0.1:5000/api/appointments', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Role': 'admin'  // ADDED THIS LINE TO FIX 403 ERROR
          },
          body: JSON.stringify({
            patient_id: patientData.id,
            doctor_id,
            date: values.date,
            time: values.time,
            reason: values.description,
            status: 'pending'
          }),
        });

        if (!appointmentRes.ok) {
          throw new Error('Failed to create appointment');
        }

        setSubmitMessage('Appointment booked successfully!');
        setTimeout(() => {
          closeForm();
        }, 2000);
      } catch (error) {
        console.error(error);
        setSubmitMessage('Error booking appointment. Please try again.');
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="landing-page">
      <NavBar openForm={openForm} />

      {isFormOpen && (
        <div className="form-modal">
          <div className="form-modal-content">
            <button className="close-btn" onClick={closeForm}>X</button>
            <h2>Book Appointment</h2>
            {submitMessage && (
              <div className={`message ${submitMessage.includes('Error') ? 'error' : 'success'}`}>
                {submitMessage}
              </div>
            )}
            <form onSubmit={formik.handleSubmit}>
              <label>
                Name:
                <input 
                  type="text" 
                  name="name" 
                  value={formik.values.name} 
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.name && formik.errors.name && (
                  <div className="error-text">{formik.errors.name}</div>
                )}
              </label>

              <label>
                Choose Doctor:
                <select 
                  name="doctor" 
                  value={formik.values.doctor} 
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select a Doctor</option>
                  <option value="Dr. Linda - Medicine Specialist">Dr. Linda - Medicine Specialist</option>
                  <option value="Dr. Alisa - Cardiology Specialist">Dr. Alisa - Cardiology Specialist</option>
                  <option value="Dr. Antony - Neurology Specialist">Dr. Antony - Neurology Specialist</option>
                  <option value="Dr. Khalid - Cancer Specialist">Dr. Khalid - Cancer Specialist</option>
                </select>
                {formik.touched.doctor && formik.errors.doctor && (
                  <div className="error-text">{formik.errors.doctor}</div>
                )}
              </label>

              <label>
                Date:
                <input 
                  type="date" 
                  name="date" 
                  value={formik.values.date} 
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.date && formik.errors.date && (
                  <div className="error-text">{formik.errors.date}</div>
                )}
              </label>

              <label>
                Time:
                <input 
                  type="time" 
                  name="time" 
                  value={formik.values.time} 
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.time && formik.errors.time && (
                  <div className="error-text">{formik.errors.time}</div>
                )}
              </label>

              <label>
                Describe Your Symptoms:
                <textarea 
                  name="description" 
                  value={formik.values.description} 
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="error-text">{formik.errors.description}</div>
                )}
              </label>

              <label>
                Phone Number:
                <input 
                  type="tel" 
                  name="phone" 
                  value={formik.values.phone} 
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <div className="error-text">{formik.errors.phone}</div>
                )}
              </label>

              <button type="submit" disabled={formik.isSubmitting} className="btn-primary">
                {formik.isSubmitting ? 'Booking...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}

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

      <Footer />
    </div>
  );
};

export default LandingPage;