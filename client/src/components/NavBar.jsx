// src/components/NavBar.jsx - UPDATED VERSION

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx"; // <<< IMPORT Auth Context

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth(); // <<< Use real user and logout function
  const navigate = useNavigate();

  // Determine the authenticated user's default dashboard path
  let dashboardPath = '/dashboard';
  if (user?.role === 'patient') {
    // Patients typically land on a booking or home page
    dashboardPath = '/';
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleAuth = () => {
    if (user) {
      logout(); // Call the logout function from context
      navigate("/");
    } else {
      navigate("/login"); // <<< FIXED: Navigate to /login instead of /signin
    }
    toggleMenu(); // Close menu on mobile after action
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-content">
          {/* Logo (Home) */}
          <div className="nav-logo">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <img src="/logo1.jpeg" alt="HealthCare Logo" className="logo-img" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
            <div className="nav-links">
              <Link to="/" className="nav-link" onClick={toggleMenu}>Home</Link>
              {
                // Show Dashboard link only if user is logged in
                user && (
                  <Link to={dashboardPath} className="nav-link" onClick={toggleMenu}>
                    Dashboard
                  </Link>
                )
              }
              {/* Login/Sign Out Button */}
              <button onClick={handleAuth} className="nav-btn">
                {user ? "Sign Out" : "Login"}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="mobile-menu-btn">
            <button onClick={toggleMenu} className="menu-toggle">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}