// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Appointments from "./pages/Appointments.jsx";
import AdminDoctors from "./pages/AdminDoctors.jsx";
import Login from "./components/Login";

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
        {/* Root route: redirect only */}
        <Route
          path="/"
          element={<Navigate to={user ? "/appointments" : "/login"} replace />}
        />

        {/* Login */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />

        {/* Appointments route */}
        <Route
          path="/appointments"
          element={user ? <Appointments /> : <Navigate to="/login" replace />}
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

export default App;
