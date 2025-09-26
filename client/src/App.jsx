// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx"; 
import LandingPage from "./pages/LandingPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Appointments from "./pages/Appointments.jsx";
import AdminDoctors from "./pages/AdminDoctors.jsx";
import Login from "./components/Login";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Original Landing Page route */}
        <Route path="/landing" element={<LandingPage />} />

        {/* Root route: redirect based on authentication */}
        <Route
          path="/"
          element={<Navigate to={user ? "/appointments" : "/login"} replace />}
        />

        {/* Login route */}
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
      <Footer />
    </Router>
  );
}

export default App;
