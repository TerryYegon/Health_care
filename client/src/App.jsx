// src/App.jsx - FINAL VERSION

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx"; 
import LandingPage from "./pages/LandingPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./components/Login.jsx";

function App() {
  const { user, loading } = useAuth(); // <<< ADDED loading state from context
  
  // Wait for the authentication state to be loaded before rendering
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading...
      </div>
    );
  }

  // Helper to determine the default authenticated route
  const defaultAuthPath = user?.role === 'clinic_admin' || user?.role === 'doctor' ? "/dashboard" : "/";

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Home route: Standardized to LandingPage / Doctor Booking View */}
        <Route path="/" element={<LandingPage />} />

        {/* Login route: Redirects logged-in users to their default path */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to={defaultAuthPath} replace />}
        />

        {/* Dashboard route: PROTECTED - Requires login */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" replace />} // <<< Dashboard Route is correct
        />

        {/* Catch-all route: Redirects to the root or login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
