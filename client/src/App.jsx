// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Appointments from "./pages/Appointments.jsx";
import AdminDoctors from "./pages/AdminDoctors.jsx";
// import Login from "./pages/Login.jsx"; // make sure you have a login page

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Root route: redirect only, don’t render pages here */}
        <Route
          path="/"
          element={
            <Navigate to={user ? "/appointments" : "/login"} replace />
          }
        />

        {/* Login */}
        {/* <Route path="/login" element={<Login />} /> */}

        {/* Appointments route */}
        <Route
          path="/appointments"
          element={
            user ? <Appointments /> : <Navigate to="/login" replace />
          }
        />

        {/* Admin Doctors route */}
        <Route
          path="/admin/doctors"
          element={
            user && user.role === "clinic_admin" ? (
              <AdminDoctors />
            ) : (
              <Navigate to={user ? "/appointments" : "/login"} replace />
            )
          }
        />

        {/* Catch-all route */}
        <Route
          path="*"
          element={<Navigate to={user ? "/appointments" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App
