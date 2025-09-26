import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // Added auth context

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth(); // Using actual auth context
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleAuth = () => {
    if (user) {
      logout();
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-content">
          {/* Logo */}
          <div className="nav-logo">
            <Link to="/">
              <img src="/logo1.jpeg" alt="HealthCare Logo" className="logo-img" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className={`nav-menu ${isMenuOpen ? "active" : ""}`}>
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/login" className="nav-link">Login</Link>
              {user && <Link to="/dashboard" className="nav-link">Dashboard</Link>}
              <button onClick={handleAuth} className="nav-btn">
                {user ? "Sign Out" : "Sign In"}
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="mobile-menu-btn">
            <button onClick={toggleMenu} className="menu-toggle">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="mobile-menu">
              <div className="mobile-menu-content">
                <Link to="/" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
                <Link to="/login" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Login</Link>
                {user && <Link to="/dashboard" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>}
                <button onClick={() => { handleAuth(); setIsMenuOpen(false); }} className="mobile-btn">
                  {user ? "Sign Out" : "Sign In"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}