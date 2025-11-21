import React from 'react';
import './SavedLooks.css';

const SavedLooks = () => {
  const savedLooks = [
    {
      id: 1,
      title: 'Wedding Guest Look',
      description: 'Elegant makeup with soft glam eyes and nude lips',
      image: '/images/wedding look1.png',
      colors: ['#D4AF37', '#8A5A44', '#2D2D2D', '#F8F5F0'],
      tags: ['Evening', 'Formal', 'Glam']
    },
    {
      id: 2,
      title: 'Casual Day Look',
      description: 'Natural makeup with dewy finish and minimal eye makeup',
      image: '/images/casual day look.png',
      colors: ['#FFB6C1', '#FFD700', '#87CEEB', '#98FB98'],
      tags: ['Daytime', 'Casual', 'Natural']
    },
    {
      id: 3,
      title: 'Office Professional',
      description: 'Professional makeup with defined brows and MLBB lips',
      image: '/images/office look.png',
      colors: ['#8A5A44', '#2D2D2D', '#D4AF37', '#FFFFFF'],
      tags: ['Office', 'Professional', 'Polished']
    }
  ];

  return (
    <section id="saved" className="section">
      <div className="container">
        <h2 className="section-heading">Your Saved Looks</h2>
        <p className="section-subheading">Browse and manage your personalized style recommendations</p>
        
        <div className="looks-grid">
          {savedLooks.map(look => (
            <div key={look.id} className="look-card">
              <div className="look-image">
                <div 
                  className="look-img-placeholder"
                  style={{ background: 'linear-gradient(45deg, #e6d7c8, #f3e9d6)' }}
                >
                  <i className="fas fa-user" style={{ fontSize: '40px', color: '#8A5A44' }}></i>
                </div>
                <div className="look-overlay">
                  <button className="look-action-btn">
                    <i className="fas fa-eye"></i>
                  </button>
                  <button className="look-action-btn">
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className="look-action-btn">
                    <i className="fas fa-share-alt"></i>
                  </button>
                </div>
              </div>
              
              <div className="look-content">
                <h3 className="look-title">{look.title}</h3>
                <p className="look-description">{look.description}</p>
                
                <div className="color-palette">
                  {look.colors.map((color, index) => (
                    <div 
                      key={index}
                      className="color-swatch"
                      style={{ backgroundColor: color }}
                      title={`Color ${index + 1}`}
                    ></div>
                  ))}
                </div>
                
                <div className="look-tags">
                  {look.tags.map((tag, index) => (
                    <span key={index} className="look-tag">{tag}</span>
                  ))}
                </div>
                
                <div className="look-actions">
                  <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}>
                    Apply Look
                  </button>
                  <div className="action-icons">
                    <i className="fas fa-heart" style={{ color: '#D4AF37' }}></i>
                    <i className="fas fa-download"></i>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="saved-actions">
          <button className="btn btn-secondary">
            <i className="fas fa-plus"></i>
            Create New Look
          </button>
          <button className="btn btn-primary">
            <i className="fas fa-sync"></i>
            Sync All Looks
          </button>
        </div>
      </div>
    </section>
  );
};

export default SavedLooks;