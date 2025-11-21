import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="logo">
              <i className="fas fa-star"></i>AI Stylist
            </div>
            <p className="footer-description">
              Your personal AI-powered beauty and fashion advisor. 
              Discover your perfect style with cutting-edge technology.
            </p>
            <div className="social-links">
              <a href="#" className="social-link">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-link">
                <i className="fab fa-pinterest"></i>
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Features</h4>
            <ul className="footer-links">
              <li><a href="#upload">AI Photo Analysis</a></li>
              <li><a href="#chat">AI Stylist Chat</a></li>
              <li><a href="#saved">Saved Looks</a></li>
              <li><a href="#features">Virtual Try-On</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Community</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 AI Stylist. All rights reserved. | Beauty & Fashion Perfected with AI</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;