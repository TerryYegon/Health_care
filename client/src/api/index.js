// src/api/index.js

// ------------------ Fake in-memory "database" ------------------
let users = [
  { id: 1, name: "Demo Patient", email: "patient@example.com", role: "patient" },
  { id: 2, name: "Demo Doctor", email: "doctor@example.com", role: "doctor" },
  { id: 3, name: "Demo Admin", email: "admin@example.com", role: "clinic_admin" },
];

let appointments = [
  {
    id: 101,
    patient_id: 1,
    patient_name: "Demo Patient",
    doctor_id: 2,
    doctor_name: "Demo Doctor",
    clinic_name: "Downtown Clinic",
    date: new Date().toISOString().split("T")[0], // today
    time: "10:00 AM",
    status: "scheduled",
    notes: "Follow-up checkup",
  },
];

// ------------------ USERS API ------------------
export const usersAPI = {
  getAll: async () => {
    await new Promise((r) => setTimeout(r, 300)); // simulate network delay
    return [...users];
  },

  update: async (id, data) => {
    users = users.map((u) => (u.id === id ? { ...u, ...data } : u));
    return users.find((u) => u.id === id);
  },

  delete: async (id) => {
    users = users.filter((u) => u.id !== id);
    return true;
  },
};

// ------------------ AUTH API ------------------
export const authAPI = {
  register: async ({ name, email, password, role = "doctor" }) => {
    await new Promise((r) => setTimeout(r, 300));
    const newUser = { id: Date.now(), name, email, role };
    users.push(newUser);
    return newUser;
  },
};

// -
