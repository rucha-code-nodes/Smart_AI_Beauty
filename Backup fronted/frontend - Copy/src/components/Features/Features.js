import React from 'react';
import './Features.css';

const Features = () => {
  const features = [
    {
      icon: 'fas fa-camera',
      title: 'AI Photo Analysis',
      description: 'Upload your photo for instant analysis of facial features, skin tone, and personal style preferences.'
    },
    {
      icon: 'fas fa-palette',
      title: 'Personalized Recommendations',
      description: 'Receive tailored makeup, hairstyle, and fashion recommendations based on your unique features.'
    },
    {
      icon: 'fas fa-robot',
      title: 'Smart Stylist Chat',
      description: 'Chat with our AI stylist for instant advice and answers to all your beauty and fashion questions.'
    },
    {
      icon: 'fas fa-save',
      title: 'Save Your Looks',
      description: 'Save your favorite looks and recommendations for easy access anytime.'
    },
    {
      icon: 'fas fa-magic',
      title: 'Virtual Try-On',
      description: 'See how different makeup and hairstyles would look on you with our virtual try-on feature.'
    },
    {
      icon: 'fas fa-sync',
      title: 'Seasonal Updates',
      description: 'Get updated recommendations based on current trends and seasonal changes.'
    }
  ];

  return (
    <section id="features" className="section">
      <div className="container">
        <h2 className="section-heading">How It Works</h2>
        <p className="section-subheading">Discover the power of AI-driven personal styling</p>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <i className={feature.icon}></i>
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="features-cta">
          <h3>Ready to Transform Your Style?</h3>
          <p>Join thousands of users who have discovered their perfect look with AI Stylist</p>
          <div className="cta-buttons">
            <a href="#upload" className="btn btn-primary">Get Started</a>
            <a href="#chat" className="btn btn-secondary">Learn More</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;