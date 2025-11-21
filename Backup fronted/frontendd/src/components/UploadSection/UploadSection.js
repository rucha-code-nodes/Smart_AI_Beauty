import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './UploadSection.css';

const UploadSection = () => {
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const { saveLook } = useAuth();

  const handleFileUpload = (event) => {
    if (event.target.files.length > 0) {
      setTimeout(() => {
        setAnalysisComplete(true);
      }, 3000);
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleSaveLook = () => {
    const look = {
      title: "AI Recommended Look",
      foundation: "Medium coverage, warm undertone",
      lipstick: "Coral pink with golden shimmer",
      hairstyle: "Loose curls with center partition",
      colors: ['#FF7D95', '#FFB6C1', '#FFD700', '#8A5A44']
    };
    saveLook(look);
    alert('Look saved successfully!');
  };

  const renderOptionResult = () => {
    const options = {
      hair: {
        title: 'Hair Partition Recommendations',
        content: `
          <div class="card-item">
            <div class="card-icon"><i class="fas fa-cut"></i></div>
            <div><strong>Center Partition:</strong> Best for balanced facial features</div>
          </div>
          <div class="card-item">
            <div class="card-icon"><i class="fas fa-cut"></i></div>
            <div><strong>Side Partition:</strong> Creates asymmetry for a more dynamic look</div>
          </div>
        `,
        imageClass: 'hair-partition'
      },
      clothing: {
        title: 'Color Clothing Recommendations',
        content: `
          <div class="card-item">
            <div class="card-icon"><i class="fas fa-tshirt"></i></div>
            <div><strong>Warm Tones:</strong> Earthy colors like terracotta, olive, mustard</div>
          </div>
          <div class="card-item">
            <div class="card-icon"><i class="fas fa-tshirt"></i></div>
            <div><strong>Cool Tones:</strong> Jewel tones like emerald, sapphire, amethyst</div>
          </div>
        `,
        imageClass: 'color-clothing'
      },
      foundation: {
        title: 'Foundation Shade Recommendations',
        content: `
          <div class="card-item">
            <div class="card-icon"><i class="fas fa-palette"></i></div>
            <div><strong>Light Coverage:</strong> Sheer finish for natural everyday look</div>
          </div>
          <div class="card-item">
            <div class="card-icon"><i class="fas fa-palette"></i></div>
            <div><strong>Medium Coverage:</strong> Buildable formula for evening events</div>
          </div>
        `,
        imageClass: 'foundation-shade'
      },
      lipstick: {
        title: 'Lipstick Shade Recommendations',
        content: `
          <div class="card-item">
            <div class="card-icon"><i class="fas fa-lips"></i></div>
            <div><strong>Nude Shades:</strong> Perfect for everyday wear and office looks</div>
          </div>
          <div class="card-item">
            <div class="card-icon"><i class="fas fa-lips"></i></div>
            <div><strong>Pink Tones:</strong> From soft blush to vibrant fuchsia</div>
          </div>
        `,
        imageClass: 'lipstick-shade'
      }
    };

    const option = options[selectedOption];
    if (!option) return null;

    return (
      <div className="option-result">
        <div className={`result-image ${option.imageClass}`}>
          <i className="fas fa-user" style={{ fontSize: '80px' }}></i>
        </div>
        <div className="result-details">
          <h3 className="result-title">{option.title}</h3>
          <div dangerouslySetInnerHTML={{ __html: option.content }} />
          <div className="color-palette" style={{ justifyContent: 'center', marginTop: '20px' }}>
            <div className="color-swatch" style={{ backgroundColor: '#8A5A44' }}></div>
            <div className="color-swatch" style={{ backgroundColor: '#D4AF37' }}></div>
            <div className="color-swatch" style={{ backgroundColor: '#2D2D2D' }}></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="upload" className="section">
      <div className="container">
        <h2 className="section-heading">Discover Your Style Profile</h2>
        <p className="section-subheading">Upload your photo for AI analysis and receive personalized beauty recommendations</p>
        
        <div className="upload-card">
          <div 
            className="upload-area" 
            onClick={() => document.getElementById('fileInput').click()}
          >
            <div className="upload-icon">
              <i className="fas fa-cloud-upload-alt"></i>
            </div>
            <p className="upload-text">Upload Your Natural Photo</p>
            <p className="upload-subtext">For best results, use daylight photo with no heavy makeup or filters</p>
          </div>
          <input 
            type="file" 
            id="fileInput" 
            style={{ display: 'none' }} 
            accept="image/*"
            onChange={handleFileUpload}
          />
          
          {analysisComplete && (
            <div className="analysis-results">
              <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Your Style Analysis</h3>
              <div className="result-grid">
                <div className="result-item">
                  <span className="result-label">Face Shape</span>
                  <span>Oval</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Skin Undertone</span>
                  <span>Warm</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Lighting Quality</span>
                  <span>Natural</span>
                </div>
              </div>
              
              <div className="look-card" style={{ marginTop: '20px', padding: '25px' }}>
                <h3 className="look-card-title">Your Recommended Look</h3>
                <div className="card-item">
                  <div className="card-icon"><i className="fas fa-palette"></i></div>
                  <div>Foundation: Medium coverage, warm undertone</div>
                </div>
                <div className="card-item">
                  <div className="card-icon"><i className="fas fa-lips"></i></div>
                  <div>Lipstick: Coral pink with golden shimmer</div>
                </div>
                <div className="card-item">
                  <div className="card-icon"><i className="fas fa-cut"></i></div>
                  <div>Hairstyle: Loose curls with center partition</div>
                </div>
                <div className="color-palette" style={{ justifyContent: 'center' }}>
                  <div className="color-swatch" style={{ backgroundColor: '#FF7D95' }}></div>
                  <div className="color-swatch" style={{ backgroundColor: '#FFB6C1' }}></div>
                  <div className="color-swatch" style={{ backgroundColor: '#FFD700' }}></div>
                  <div className="color-swatch" style={{ backgroundColor: '#8A5A44' }}></div>
                </div>
                <button className="btn btn-primary" onClick={handleSaveLook} style={{ marginTop: '20px' }}>
                  Save This Look
                </button>
              </div>
            </div>
          )}
          
          {analysisComplete && (
            <div className="style-options">
              <h3 className="options-title">Customize Your Look</h3>
              <p className="section-subheading" style={{ marginBottom: '30px' }}>Select a category to see personalized recommendations</p>
              
              <div className="options-grid">
                <div 
                  className={`option-btn ${selectedOption === 'hair' ? 'active' : ''}`}
                  onClick={() => handleOptionClick('hair')}
                >
                  <i className="fas fa-cut option-icon"></i>
                  <span className="option-text">Hair Partition</span>
                </div>
                <div 
                  className={`option-btn ${selectedOption === 'clothing' ? 'active' : ''}`}
                  onClick={() => handleOptionClick('clothing')}
                >
                  <i className="fas fa-tshirt option-icon"></i>
                  <span className="option-text">Color Clothing</span>
                </div>
                <div 
                  className={`option-btn ${selectedOption === 'foundation' ? 'active' : ''}`}
                  onClick={() => handleOptionClick('foundation')}
                >
                  <i className="fas fa-palette option-icon"></i>
                  <span className="option-text">Foundation Shade</span>
                </div>
                <div 
                  className={`option-btn ${selectedOption === 'lipstick' ? 'active' : ''}`}
                  onClick={() => handleOptionClick('lipstick')}
                >
                  <i className="fas fa-lips option-icon"></i>
                  <span className="option-text">Lipstick Shade</span>
                </div>
              </div>
            </div>
          )}
          
          {selectedOption && renderOptionResult()}
        </div>
      </div>
    </section>
  );
};

export default UploadSection;