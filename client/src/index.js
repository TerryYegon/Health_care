// src/api/index.js

const BASE_URL = 'http://localhost:5000'; // your backend URL

export const usersAPI = {
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  }
};

export const appointmentsAPI = {
  getAll: async () => {
    const res = await fetch(`${BASE_URL}/appointments`);
    if (!res.ok) throw new Error('Failed to fetch appointments');
    return res.json();
  },
  update: async (id, data) => {
    const res = await fetch(`${BASE_URL}/appointments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to update appointment');
    return res.json();
  }
};
