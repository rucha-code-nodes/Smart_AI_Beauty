import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="container" id="home">
      <div className="hero">
        <div className="hero-content">
          <h1 className="hero-heading">Your Personal AI Stylist — Beauty & Fashion Perfected</h1>
          <p className="hero-subheading">Discover your perfect style with AI-powered recommendations for makeup, hair, and fashion tailored just for you.</p>
          <div className="hero-buttons">
            <a href="#upload" className="btn btn-primary">Try It Now</a>
            <a href="#chat" className="btn btn-secondary">Chat with Stylist</a>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-container">
            <div className="hero-img" style={{ background: 'linear-gradient(45deg, #e6d7c8, #f3e9d6)' }}></div>
            <div className="floating-card">
              <h4>Your Personalized Look</h4>
              <div className="card-item">
                <div className="card-icon"><i className="fas fa-palette"></i></div>
                <div>Foundation: Medium coverage, neutral</div>
              </div>
              <div className="card-item">
                <div className="card-icon"><i className="fas fa-lips"></i></div>
                <div>Lipstick: Deep rose with coral tint</div>
              </div>
              <div className="card-item">
                <div className="card-icon"><i className="fas fa-cut"></i></div>
                <div>Hairstyle: Side partition with waves</div>
              </div>
              <div className="color-palette">
                <div className="color-swatch" style={{ backgroundColor: '#D4AF37' }}></div>
                <div className="color-swatch" style={{ backgroundColor: '#8A5A44' }}></div>
                <div className="color-swatch" style={{ backgroundColor: '#2D2D2D' }}></div>
                <div className="color-swatch" style={{ backgroundColor: '#F8F5F0' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;