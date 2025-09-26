import React from 'react';
import { useFormik } from 'formik';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './SignIn.css';

const SignIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      role: 'patient' // patient, doctor, or admin
    },
    validate: (values) => {
      const errors = {};
      
      // String format validation
      if (!values.username) {
        errors.username = 'Username is required';
      } else if (values.username.length < 3) {
        errors.username = 'Username must be at least 3 characters';
      }

      // Data type and format validation
      if (!values.password) {
        errors.password = 'Password is required';
      } else if (values.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }

      if (!values.role) {
        errors.role = 'Please select a role';
      }

      return errors;
    },
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await login(values.username, values.password);
        navigate('/dashboard');
      } catch (error) {
        setErrors({ submit: error.message });
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="signin-container">
      <div className="signin-form">
        <h2>Sign In</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="role">I am a:</label>
            <select
              id="role"
              name="role"
              onChange={formik.handleChange}
              value={formik.values.role}
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Clinic Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              name="username"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.username}
              placeholder="Enter your username"
            />
            {formik.errors.username && (
              <div className="error">{formik.errors.username}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              placeholder="Enter your password"
            />
            {formik.errors.password && (
              <div className="error">{formik.errors.password}</div>
            )}
          </div>

          {formik.errors.submit && (
            <div className="error submit-error">{formik.errors.submit}</div>
          )}

          <button 
            type="submit" 
            disabled={formik.isSubmitting}
            className="submit-btn"
          >
            {formik.isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-accounts">
          <h4>Demo Accounts:</h4>
          <p>Patient: patient@example.com / password123</p>
          <p>Doctor: doctor@example.com / password123</p>
          <p>Admin: admin@example.com / password123</p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;