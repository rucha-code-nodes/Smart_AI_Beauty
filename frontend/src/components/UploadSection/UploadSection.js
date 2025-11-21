



// import { useAuth } from '../../context/AuthContext';
// import './UploadSection.css';
// import React, { useState, useEffect } from 'react';

// const UploadSection = () => {
//   useEffect(() => { console.log('Upload mounted'); }, []);

//   const [analysisComplete, setAnalysisComplete] = useState(false);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const { saveLook } = useAuth();
//   const [faceShape, setFaceShape] = useState("");
//   const [skinTone, setSkinTone] = useState("");
//   const [recommendations, setRecommendations] = useState({});

//   const handleFileUpload = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const res = await fetch("http://127.0.0.1:8000/analyze/", {
//         method: "POST",
         
//         body: formData,
//       });

//       if (!res.ok) {
//         const text = await res.text();
//         console.error("Server error:", text);
//         setRecommendations({
//           foundation: "N/A",
//           clothing: [],
//           hairstyle: "N/A",
//         });
//         return;
//       }

//       const data = await res.json();
//       console.log("AI Response:", data);

//       setFaceShape(data.face_shape || "Unknown");
//       setSkinTone(data.skin_tone || "Unknown");
//       setRecommendations(data.recommendations || {
//         foundation: "N/A",
//         clothing: [],
//         hairstyle: "N/A",
//       });
//       setAnalysisComplete(true);
//     } catch (err) {
//       console.error("Fetch failed:", err);
//       setRecommendations({
//         foundation: "N/A",
//         clothing: [],
//         hairstyle: "N/A",
//       });
//     }
//   };

//   const handleOptionClick = (option) => {
//     setSelectedOption(option);
//   };

//   const handleSaveLook = () => {
//     const look = {
//       title: "AI Recommended Look",
//       foundation: recommendations.foundation || "Medium coverage, warm undertone",
//       lipstick: "Coral pink with golden shimmer",
//       hairstyle: recommendations.hairstyle || "Loose curls with center partition",
//       colors: recommendations.clothing || ['#FF7D95', '#FFB6C1', '#FFD700', '#8A5A44']
//     };
//     saveLook(look);
//     alert('Look saved successfully!');
//   };

//   const renderOptionResult = () => {
//     const options = {
//      hair: {
//   title: "Hair Partition Recommendations",
//   content: (
//     <div className="card-item">
//       <div className="card-icon"><i className="fas fa-cut"></i></div>
//       <div>{recommendations?.hairstyle || "Detecting best hairstyle..."}</div>
//     </div>
//   ),
//   imageClass: "hair-partition"
// },
//       clothing: {
//         title: "Color Clothing Recommendations",
//         content: (
//           <div>
//             {(recommendations?.clothing || []).map((color, index) => (
//               <div key={index} className="card-item">
//                 <div className="card-icon"><i className="fas fa-tshirt"></i></div>
//                 <div>{color}</div>
//               </div>
//             ))}
//           </div>
//         ),
//         imageClass: "color-clothing"
//       },
//       foundation: {
//         title: "Foundation Shade Recommendations",
//         content: (
//           <div className="card-item">
//             <div className="card-icon"><i className="fas fa-palette"></i></div>
//             <div>{recommendations?.foundation || "N/A"}</div>
//           </div>
//         ),
//         imageClass: "foundation-shade"
//       },
//       lipstick: {
//   title: "Lipstick Shade Recommendations",
//   content: (
//     <div className="card-item">
//       <div className="card-icon"><i className="fas fa-lips"></i></div>
//       <div>{recommendations?.lipstick || "Detecting..."}</div>
//     </div>
//   ),
//   imageClass: "lipstick-shade"
// }

//     };

//     // Only render the selected option
//     if (!selectedOption) return null;
//     const option = options[selectedOption];
//     return (
//       <div className={`option-card ${option.imageClass}`}>
//         <h3>{option.title}</h3>
//         {option.content}
//       </div>
//     );
//   };

//   return (
//     <section id="upload" className="section">
//       <div className="container">
//         <h2 className="section-heading">Discover Your Style Profile</h2>
//         <p className="section-subheading">Upload your photo for AI analysis and receive personalized beauty recommendations</p>

//         <div className="upload-card">
//           <div className="upload-area" onClick={() => document.getElementById('fileInput').click()}>
//             <div className="upload-icon"><i className="fas fa-cloud-upload-alt"></i></div>
//             <p className="upload-text">Upload Your Natural Photo</p>
//             <p className="upload-subtext">For best results, use daylight photo with no heavy makeup or filters</p>
//           </div>
//           <input 
//             type="file" 
//             id="fileInput" 
//             style={{ display: 'none' }} 
//             accept="image/*"
//             onChange={handleFileUpload}
//           />

//           {analysisComplete && (
//             <div className="analysis-results">
//               <h3 style={{ textAlign: 'center', marginBottom: '30px' }}>Your Style Analysis</h3>
//               <div className="result-grid">
//                 <div className="result-item">
//                   <span className="result-label">Face Shape</span>
//                   <span>{faceShape}</span>
//                 </div>
//                 <div className="result-item">
//                   <span className="result-label">Skin Undertone</span>
//                   <span>{skinTone}</span>
//                 </div>
//                 <div className="result-item">
//                   <span className="result-label">Lighting Quality</span>
//                   <span>Natural</span>
//                 </div>
//               </div>

//               <div className="look-card" style={{ marginTop: '20px', padding: '25px' }}>
//                 <h3 className="look-card-title">Your AI-Based Look Recommendations</h3>
                
//                 <div className="card-item">
//                   <div className="card-icon"><i className="fas fa-palette"></i></div>
//                   <div>Foundation: {recommendations.foundation || "Detecting..."}</div>
//                 </div>
//                 <div className="card-item">
//                   <div className="card-icon"><i className="fas fa-tshirt"></i></div>
//                   <div>Clothing Colors: {(recommendations.clothing || []).join(', ')}</div>
//                 </div>
//                 <div className="card-item">
//                   <div className="card-icon"><i className="fas fa-cut"></i></div>
//                   <div>Hairstyle: {recommendations.hairstyle || "Detecting..."}</div>
//                 </div>

//                 <div className="color-palette" style={{ justifyContent: 'center' }}>
//                   {(recommendations.clothing || []).map((color, i) => (
//                     <div key={i} className="color-swatch" style={{ backgroundColor: color }} title={color}></div>
//                   ))}
//                 </div>

//                 <button className="btn btn-primary" onClick={handleSaveLook} style={{ marginTop: '20px' }}>
//                   Save This Look
//                 </button>
//               </div>
//             </div>
//           )}

//           {analysisComplete && (
//             <div className="style-options">
//               <h3 className="options-title">Customize Your Look</h3>
//               <p className="section-subheading" style={{ marginBottom: '30px' }}>
//                 Select a category to see personalized recommendations
//               </p>

//               <div className="options-grid">
//                 {['hair','clothing','foundation','lipstick'].map(opt => (
//                   <div 
//                     key={opt}
//                     className={`option-btn ${selectedOption === opt ? 'active' : ''}`}
//                     onClick={() => handleOptionClick(opt)}
//                   >
//                     <i className={`fas fa-${opt==='hair'?'cut':opt==='clothing'?'tshirt':opt==='foundation'?'palette':'lips'} option-icon`}></i>
//                     <span className="option-text">{opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
//                   </div>
//                 ))}
//               </div>

//               {renderOptionResult()}
//             </div>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default UploadSection;









import { useAuth } from '../../context/AuthContext';
import './UploadSection.css';
import React, { useState, useEffect } from 'react';

const UploadSection = () => {
  useEffect(() => { console.log('Upload mounted'); }, []);

  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const { saveLook } = useAuth();
  const [faceShape, setFaceShape] = useState("");
  const [skinTone, setSkinTone] = useState("");
  const [recommendations, setRecommendations] = useState({});

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:5000/analyze/", {
        method: "POST",
         
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server error:", text);
        setRecommendations({
          foundation: "N/A",
          clothing: [],
          hairstyle: "N/A",
        });
        return;
      }

      const data = await res.json();
      console.log("AI Response:", data);

      setFaceShape(data.face_shape || "Unknown");
      setSkinTone(data.skin_tone || "Unknown");
      setRecommendations(data.recommendations || {
  foundation: "N/A",
  clothing: [],
  hairstyle: "Detecting best hairstyle...",
  lipstick: "Detecting best lipstick shade..."
});

      setAnalysisComplete(true);
    } catch (err) {
      console.error("Fetch failed:", err);
      setRecommendations({
        foundation: "N/A",
        clothing: [],
        hairstyle: "N/A",
      });
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleSaveLook = () => {
    const look = {
      title: "AI Recommended Look",
      foundation: recommendations.foundation || "Medium coverage, warm undertone",
      lipstick: "Coral pink with golden shimmer",
      hairstyle: recommendations.hairstyle || "Loose curls with center partition",
      colors: recommendations.clothing || ['#FF7D95', '#FFB6C1', '#FFD700', '#8A5A44']
    };
    saveLook(look);
    alert('Look saved successfully!');
  };

const renderOptionResult = () => {
  const options = {
    hair: {
      title: "Hair Partition Recommendations",
      content: (
        <div className="card-item">
          <div className="card-icon"><i className="fas fa-cut"></i></div>
          <div>
            <div dangerouslySetInnerHTML={{ __html: recommendations?.hairstyleFemale || "Detecting best hairstyle..." }} />
            <br />
            <div dangerouslySetInnerHTML={{ __html: recommendations?.hairstyleMale || "Detecting best hairstyle..." }} />
          </div>
        </div>
      ),
      imageClass: "hair-partition"
    },
    clothing: {
      title: "Color Clothing Recommendations",
      content: (
        <div>
          {(recommendations?.clothing || []).map((color, index) => (
            <div key={index} className="card-item">
              <div className="card-icon"><i className="fas fa-tshirt"></i></div>
              <div>{color}</div>
            </div>
          ))}
        </div>
      ),
      imageClass: "color-clothing"
    },
    foundation: {
      title: "Foundation Shade Recommendations",
      content: (
        <div className="card-item">
          <div className="card-icon"><i className="fas fa-palette"></i></div>
          <div>{recommendations?.foundation || "N/A"}</div>
        </div>
      ),
      imageClass: "foundation-shade"
    },
    lipstick: {
      title: "Lipstick Shade Recommendations",
      content: (
        <div className="card-item">
          <div className="card-icon"><i>💋</i></div>
          <div>
            <div dangerouslySetInnerHTML={{ __html: recommendations?.lipstickFemale || "Detecting..." }} />
            <br />
            <div dangerouslySetInnerHTML={{ __html: recommendations?.lipstickMale || "Detecting..." }} />
          </div>
        </div>
      ),
      imageClass: "lipstick-shade"
    }
  };

  if (!selectedOption) return null;
  const option = options[selectedOption];
  return (
    <div className={`option-card ${option.imageClass}`}>
      <h3>{option.title}</h3>
      {option.content}
    </div>
  );
};


  return (
    <section id="upload" className="section">
      <div className="container">
        <h2 className="section-heading">Discover Your Style Profile</h2>
        <p className="section-subheading">Upload your photo for AI analysis and receive personalized beauty recommendations</p>

        <div className="upload-card">
          <div className="upload-area" onClick={() => document.getElementById('fileInput').click()}>
            <div className="upload-icon"><i className="fas fa-cloud-upload-alt"></i></div>
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
                  <span>{faceShape}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Skin Undertone</span>
                  <span>{skinTone}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Lighting Quality</span>
                  <span>Natural</span>
                </div>
              </div>

<div className="look-card">
  <h3 className="look-card-title">💄 Your AI-Based Look Recommendations</h3>

  <ul className="recommendation-list left-align">
    {/* Foundation */}
    <li>
      <strong>Foundation:</strong> {recommendations.foundation || "Detecting..."}
    </li>

   {/* Clothing Colors */}
<li>
  <strong>Clothing Colors:</strong>
  <ul>
    {(recommendations.clothing || []).map((color, i) => (
      <li key={i}>{color}</li>
    ))}
  </ul>
</li>

{/* Color Swatches */}
<div
  className="color-palette"
  style={{
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: '15px',
    gap: '8px',
  }}
>
  {(recommendations.clothing || []).map((color, i) => {
    // Replace spaces and make lowercase to match CSS-friendly colors
    const cssColor = color.toLowerCase().replace(/\s+/g, '');
    return (
      <div
        key={i}
        className="color-swatch"
        style={{
          backgroundColor: cssColor,
          width: '30px',
          height: '30px',
          borderRadius: '6px',
          border: '1px solid #ccc',
        }}
        title={color}
      ></div>
    );
  })}
</div>


    {/* Hairstyle Section */}
    <li>
      <strong>Hairstyle:</strong>
      <div className="gender-section">
        <div className="gender-label">Female:</div>
        <div
          className="gender-details"
          dangerouslySetInnerHTML={{ __html: recommendations.hairstyleFemale || "Detecting..." }}
        />
      </div>

      <div className="gender-section">
        <div className="gender-label">Male:</div>
        <div
          className="gender-details"
          dangerouslySetInnerHTML={{ __html: recommendations.hairstyleMale || "Detecting..." }}
        />
      </div>
    </li>

    {/* Lipstick Section */}
    <li>
      <strong>Lipstick:</strong>
      <div className="gender-section">
        <div className="gender-label">Female:</div>
        <div
          className="gender-details"
          dangerouslySetInnerHTML={{ __html: recommendations.lipstickFemale || "Detecting..." }}
        />
      </div>

      <div className="gender-section">
        <div className="gender-label">Male:</div>
        <div
          className="gender-details"
          dangerouslySetInnerHTML={{ __html: recommendations.lipstickMale || "Detecting..." }}
        />
      </div>
    </li>
  </ul>

 

  <button className="btn btn-primary" onClick={handleSaveLook} style={{ marginTop: '20px' }}>
    Save This Look
  </button>
</div>



            </div>
          )}

          {analysisComplete && (
            <div className="style-options">
              <h3 className="options-title">Customize Your Look</h3>
              <p className="section-subheading" style={{ marginBottom: '30px' }}>
                Select a category to see personalized recommendations
              </p>

              <div className="options-grid">
                {['hair','clothing','foundation','lipstick'].map(opt => (
                  <div 
                    key={opt}
                    className={`option-btn ${selectedOption === opt ? 'active' : ''}`}
                    onClick={() => handleOptionClick(opt)}
                  >
                  <i className="option-icon">
  {opt === 'lipstick' ? (
    <span style={{ fontSize: '35px', verticalAlign: 'middle' }}>💋</span>
  ) : (
    <i
      className={`fas fa-${
        opt === 'hair'
          ? 'cut'
          : opt === 'clothing'
          ? 'tshirt'
          : opt === 'foundation'
          ? 'palette'
          : ''
      }`}
    ></i>
  )}
</i>



                    <span className="option-text">{opt.charAt(0).toUpperCase() + opt.slice(1)}</span>
                  </div>
                ))}
              </div>

              {renderOptionResult()}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default UploadSection;
