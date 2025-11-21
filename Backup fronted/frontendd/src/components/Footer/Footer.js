import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <i className="fas fa-star"></i>AI Stylist
            </div>
            <p className="footer-description">
              Your personal AI-powered beauty and fashion assistant. 
              Discover your perfect style with intelligent recommendations 
              tailored just for you.
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
              <li><a href="#chat">Style Chat</a></li>
              <li><a href="#saved">Saved Looks</a></li>
              <li><a href="#features">Virtual Try-On</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><a href="#help">Help Center</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#tutorials">Tutorials</a></li>
              <li><a href="#community">Community</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Newsletter</h4>
            <p className="newsletter-text">
              Stay updated with the latest style trends and AI beauty tips.
            </p>
            <form className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2024 AI Stylist. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#privacy">Privacy</a>
              <a href="#terms">Terms</a>
              <a href="#cookies">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;