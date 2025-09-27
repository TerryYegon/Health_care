import React from "react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-column">
            <h3 className="footer-title">HealthCare</h3>
            <p className="footer-text">
              Your trusted partner in health and wellness. Providing quality care for you and your family.
            </p>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-list">
              <li>Find Doctors</li>
              <li>Book Appointments</li>
              <li>Online Consultations</li>
              <li>Emergency Care</li>
            </ul>
          </div>

          
          <div className="footer-column">
            <h4 className="footer-heading">Contact</h4>
            <div className="footer-contact">
              <p>📞 +2547890567830</p>
              <p>✉️ help@healthcare.com</p>
              <p>📍 Healthcare medical city</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 HealthCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
