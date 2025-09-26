// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Appointments from "./pages/Appointments.jsx";
import AdminDoctors from "./pages/AdminDoctors.jsx";
import Login from "./components/Login";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx"; 
import LandingPage from "./pages/LandingPage.jsx";

function App() {
  return (
    <Router>
      <Navbar />
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
        <Route path="/" element={<LandingPage />} />
        {/* You can add more routes here */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
