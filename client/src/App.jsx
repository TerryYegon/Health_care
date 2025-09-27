// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Appointments from "./pages/Appointments.jsx";
import Login from "./components/Login";
import Navbar from "./components/NavBar.jsx";
import Footer from "./components/Footer.jsx"; 
import LandingPage from "./pages/LandingPage.jsx";
import SignIn from "./pages/SignIn.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  const { user } = useAuth(); // ✅ ensure user is available

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Root route */}
        <Route path="/" element={<LandingPage />} />

        {/* Login */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/appointments" replace />}
        />

        {/* SignIn (if you want a separate one) */}
        <Route
          path="/signin"
          element={!user ? <SignIn /> : <Navigate to="/appointments" replace />}
        />

        {/* Appointments route */}
        <Route
          path="/appointments"
          element={user ? <Appointments /> : <Navigate to="/login" replace />}
        />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" replace />}
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