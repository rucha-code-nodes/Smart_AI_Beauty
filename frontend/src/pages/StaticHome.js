import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import './StaticHome.css';

const StaticHome = () => {
  return (
    <div className="static-home">
      <Navbar />
      
      <section className="static-hero">
        <div className="container">
          <div className="static-hero-content">
            <h1>Your Personal AI Stylist — Beauty & Fashion Perfected</h1>
            <p>Discover your perfect style with AI-powered recommendations for makeup, hair, and fashion tailored just for you.</p>
            <div className="static-hero-buttons">
              <Link to="/signup" className="btn btn-primary">Get Started Free</Link>
              <button className="btn btn-secondary">Watch Demo</button>
            </div>
          </div>
          <div className="static-hero-image">
            <div className="hero-visual">
              <div className="floating-card demo-card">
                <h4>AI Style Analysis</h4>
                <p>Get personalized recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="static-features">
        <div className="container">
          <h2>How AI Stylist Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📷</div>
              <h3>Upload Photo</h3>
              <p>Share a natural photo for AI analysis</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Analysis</h3>
              <p>Get personalized style recommendations</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💫</div>
              <h3>Discover Style</h3>
              <p>Try new looks and save favorites</p>
            </div>
          </div>
        </div>
      </section>

      <section className="static-cta">
        <div className="container">
          <h2>Ready to Discover Your Perfect Style?</h2>
          <p>Join thousands of users who found their signature look</p>
          <Link to="/signup" className="btn btn-primary large">Start Your Style Journey</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default StaticHome;