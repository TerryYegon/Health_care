// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import Appointments from "./pages/Appointments.jsx";

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
        {/* Default route */}
        <Route
          path="/"
          element={
            user ? <Appointments /> : <Navigate to="/login" replace />
          }
        />

        {/* Appointments route */}
        <Route
          path="/appointments"
          element={
            user ? <Appointments /> : <Navigate to="/login" replace />
          }
        />

        {/* Catch-all */}
        <Route
          path="*"
          element={<Navigate to={user ? "/appointments" : "/"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
