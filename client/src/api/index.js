// src/api/index.js - FINAL VERSION

const BASE_URL = 'http://localhost:5000/api'; // The base URL for all API requests

// Function for making authenticated requests (utility)
const makeRequest = async (path, options = {}) => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem('token');
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(errorBody.message || `API request failed with status ${res.status}`);
  }
  
  return res.status === 204 ? null : res.json();
};

// ------------------ AUTH API ------------------
export const authAPI = {
  login: async (credentials, role) => {
    // Correctly build the URL based on the specified role
    const res = await fetch(`http://localhost:5000/api/login/${role}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({ message: 'Login Failed' }));
      throw new Error(errorBody.message || 'Login failed.');
    }
    
    const data = await res.json();
    localStorage.setItem('token', data.token);
    return data.user;
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};

// ------------------ PATIENTS API ------------------
export const patientsAPI = {
  getAll: () => makeRequest('/patients'),
};

// ------------------ DOCTORS API ------------------
export const doctorsAPI = {
  getAll: () => makeRequest('/doctors'), 
};

// ------------------ APPOINTMENTS API ------------------
export const appointmentsAPI = {
  getAll: () => makeRequest('/appointments'), 

  create: (appointmentData) => makeRequest('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData)
  }),

  assignDoctor: (id, doctorId) => makeRequest(`/appointments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ doctor_id: doctorId })
  }),

  updateStatus: (id, status) => makeRequest(`/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),

  delete: (id) => makeRequest(`/appointments/${id}`, {
    method: 'DELETE'
  }),
};
