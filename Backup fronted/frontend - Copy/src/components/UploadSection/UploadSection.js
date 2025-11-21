import React, { useState } from 'react';
import './UploadSection.css';

const UploadSection = () => {
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleFileUpload = (event) => {
    if (event.target.files.length > 0) {
      // Simulate analysis
      setTimeout(() => {
        setAnalysisComplete(true);
      }, 3000);
    }
  };

  const optionData = {
    hairPartition: {
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
        <div class="card-item">
          <div class="card-icon"><i class="fas fa-cut"></i></div>
          <div><strong>Deep Side Partition:</strong> Dramatic look that elongates the face</div>
        </div>
        <div class="card-item">
          <div class="card-icon"><i class="fas fa-cut"></i></div>
          <div><strong>Zigzag Partition:</strong> Adds texture and visual interest</div>
        </div>
        <div class="color-palette" style="justify-content: center; margin-top: 20px;">
          <div class="color-swatch" style="background-color: #8A5A44;"></div>
          <div class="color-swatch" style="background-color: #D4AF37;"></div>
          <div class="color-swatch" style="background-color: #2D2D2D;"></div>
        </div>
      `
    },
    colorClothing: {
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
        <div class="card-item">
          <div class="card-icon"><i class="fas fa-tshirt"></i></div>
          <div><strong>Neutral Tones:</strong> Classic colors like navy, charcoal, ivory</div>
        </div>
        <div class="card-item">
          <div class="card-icon"><i class="fas fa-tshirt"></i></div>
          <div><strong>Accent Colors:</strong> Pop colors like coral, turquoise, fuchsia</div>
        </div>
        <div class="color-palette" style="justify-content: center; margin-top: 20px;">
          <div class="color-swatch" style="background-color: #8A5A44;"></div>
          <div class="color-swatch" style="background-color: #D4AF37;"></div>
          <div class="color-swatch" style="background-color: #2D2D2D;"></div>
          <div class="color-swatch" style="background-color: #8A5A44;"></div>
          <div class="color-swatch" style="background-color: #D4AF37;"></div>
        </div>
      `
    },
    foundationShade: {
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
        <div class="card-item">
          <div class="card-icon"><i class="fas fa-palette"></i></div>
          <div><strong>Full Coverage:</strong> Maximum coverage for special occasions</div>
        </div>
        <div class="card-item">
          <div class="card-icon"><i class="fas fa-palette"></i></div>
          <div><strong>Tinted Moisturizer:</strong> Hydrating with light coverage</div>
        </div>
        <div class="color-palette" style="justify-content: center; margin-top: 20px;">
          <div class="color-swatch" style="background-color: #F3E5AB;"></div>
          <div class="color-swatch" style="background-color: #E6BC77;"></div>
          <div class="color-swatch" style="background-color: #D2A45B;"></div>
          <div class="color-swatch" style="background-color: #B8864C;"></div>
          <div class="color-swatch" style="background-color: #8B5A2B;"></div>
        </div>
      `
    },
    lipstickShade: {
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
        <div class="card-item">
          <div class="card-icon"><i class="fas fa-lips"></i></div>
          <div><strong>Red Variations:</strong> Classic reds with blue or orange undertones</div>
        </div>
        <div class="card-item">
          <div class="card-icon"><i class="fas fa-lips"></i></div>
          <div><strong>Berry Hues:</strong> Deep plums and wines for evening glamour</div>
        </div>
        <div class="color-palette" style="justify-content: center; margin-top: 20px;">
          <div class="color-swatch" style="background-color: #F8C8C8;"></div>
          <div class="color-swatch" style="background-color: #FF7D95;"></div>
          <div class="color-swatch" style="background-color: #D2042D;"></div>
          <div class="color-swatch" style="background-color: #800020;"></div>
          <div class="color-swatch" style="background-color: #4A0C0C;"></div>
        </div>
      `
    }
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
            <div className="analysis-results" id="analysisResults">
              <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Your Style Analysis</h3>
              <div className="result-grid">
                <div className="result-item">
                  <span className="result-label">Face Shape</span>
                  <span id="faceShapeResult">Oval</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Skin Undertone</span>
                  <span id="skinToneResult">Warm</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Lighting Quality</span>
                  <span id="lightingResult">Natural</span>
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
              </div>
            </div>
          )}
          
          {analysisComplete && (
            <div className="style-options" id="styleOptions">
              <h3 className="options-title">Customize Your Look</h3>
              <p className="section-subheading" style={{ marginBottom: '30px' }}>Select a category to see personalized recommendations</p>
              
              <div className="options-grid">
                <div 
                  className={`option-btn ${selectedOption === 'hairPartition' ? 'active' : ''}`}
                  onClick={() => setSelectedOption('hairPartition')}
                >
                  <i className="fas fa-cut option-icon"></i>
                  <span className="option-text">Hair Partition</span>
                </div>
                <div 
                  className={`option-btn ${selectedOption === 'colorClothing' ? 'active' : ''}`}
                  onClick={() => setSelectedOption('colorClothing')}
                >
                  <i className="fas fa-tshirt option-icon"></i>
                  <span className="option-text">Color Clothing</span>
                </div>
                <div 
                  className={`option-btn ${selectedOption === 'foundationShade' ? 'active' : ''}`}
                  onClick={() => setSelectedOption('foundationShade')}
                >
                  <i className="fas fa-palette option-icon"></i>
                  <span className="option-text">Foundation Shade</span>
                </div>
                <div 
                  className={`option-btn ${selectedOption === 'lipstickShade' ? 'active' : ''}`}
                  onClick={() => setSelectedOption('lipstickShade')}
                >
                  <i className="fas fa-lips option-icon"></i>
                  <span className="option-text">Lipstick Shade</span>
                </div>
              </div>
            </div>
          )}
          
          {selectedOption && (
            <div className="option-result" id="optionResult">
              <div className="result-image" id="resultImage">
                <i className="fas fa-user" style={{ fontSize: '80px' }}></i>
              </div>
              <div className="result-details" id="resultDetails">
                <h3 className="result-title" id="resultTitle">
                  {optionData[selectedOption].title}
                </h3>
                <div 
                  id="resultContent"
                  dangerouslySetInnerHTML={{ __html: optionData[selectedOption].content }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UploadSection;