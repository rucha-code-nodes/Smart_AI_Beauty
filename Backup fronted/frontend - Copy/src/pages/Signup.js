import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import './Signup.css';

const Signup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(0); // 0: initial, 1: email, 2: OTP, 3: new password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    otp: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setForgotPasswordStep(1);
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    // Simulate sending OTP
    setForgotPasswordStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    // Simulate OTP verification
    setForgotPasswordStep(3);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    // Simulate password reset
    alert('Password reset successfully!');
    setForgotPasswordStep(0);
    setFormData({
      ...formData,
      password: '',
      confirmPassword: ''
    });
  };

  const handleBackToLogin = () => {
    setForgotPasswordStep(0);
  };

  const handleResendOtp = () => {
    alert('Verification code has been resent to your email.');
  };

  const renderForgotPasswordForm = () => {
    switch (forgotPasswordStep) {
      case 1: // Email step
        return (
          <div className="forgot-password-form">
            <div className="auth-header">
              <h2>Reset Your Password</h2>
              <p>Enter your email to receive a verification code</p>
            </div>
            
            <form className="auth-form" onSubmit={handleSendOtp}>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email" 
                  required 
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={handleBackToLogin}
                >
                  Back to Login
                </button>
                <button type="submit" className="btn btn-primary">
                  Send Code
                </button>
              </div>
            </form>
          </div>
        );

      case 2: // OTP step
        return (
          <div className="forgot-password-form">
            <div className="auth-header">
              <h2>Enter Verification Code</h2>
              <p>We sent a 6-digit code to {formData.email}</p>
            </div>
            
            <form className="auth-form" onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <label>Verification Code</label>
                <input 
                  type="text" 
                  name="otp"
                  value={formData.otp}
                  onChange={handleInputChange}
                  placeholder="Enter 6-digit code" 
                  maxLength="6"
                  required 
                />
              </div>
              
              <div className="resend-otp">
                <p>Didn't receive the code? <button type="button" className="resend-link" onClick={handleResendOtp}>Resend</button></p>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setForgotPasswordStep(1)}
                >
                  Back
                </button>
                <button type="submit" className="btn btn-primary">
                  Verify Code
                </button>
              </div>
            </form>
          </div>
        );

      case 3: // New password step
        return (
          <div className="forgot-password-form">
            <div className="auth-header">
              <h2>Create New Password</h2>
              <p>Enter your new password below</p>
            </div>
            
            <form className="auth-form" onSubmit={handleResetPassword}>
              <div className="form-group password-group">
                <label>New Password</label>
                <div className="password-input-container">
                  <input 
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter new password" 
                    required 
                  />
                  <button 
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>
              
              <div className="form-group password-group">
                <label>Confirm New Password</label>
                <div className="password-input-container">
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm new password" 
                    required 
                  />
                  <button 
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setForgotPasswordStep(2)}
                >
                  Back
                </button>
                <button type="submit" className="btn btn-primary">
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  // const handleFormSubmit = (e) => {
  //   e.preventDefault();
  //   if (!isLogin && formData.password !== formData.confirmPassword) {
  //     alert("Passwords don't match!");
  //     return;
  //   }
  //   // Handle form submission
  //   alert(isLogin ? 'Login successful!' : 'Account created successfully!');
  // };

  const handleFormSubmit = async (e) => {
  e.preventDefault();

  const endpoint = isLogin ? "login" : "signup";
  const response = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // sends cookies
    body: JSON.stringify({
      name: formData.name,
      email: formData.email,
      password: formData.password
    })
  });

  const data = await response.json();
  alert(data.message);
};



  if (forgotPasswordStep > 0) {
    return (
      <div className="signup-page">
        <Navbar />
        <div className="auth-container">
          <div className="auth-card">
            {renderForgotPasswordForm()}
          </div>
          
          <div className="auth-hero">
            <div className="auth-hero-content">
              <h3>Your Personal AI Stylist Awaits</h3>
              <p>Join thousands of users who have discovered their perfect style with AI-powered recommendations</p>
              <div className="auth-features">
                <div className="auth-feature">
                  <i className="fas fa-robot"></i>
                  <span>AI-Powered Styling</span>
                </div>
                <div className="auth-feature">
                  <i className="fas fa-camera"></i>
                  <span>Photo Analysis</span>
                </div>
                <div className="auth-feature">
                  <i className="fas fa-save"></i>
                  <span>Save Your Looks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="signup-page">
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p>{isLogin ? 'Sign in to your AI Stylist account' : 'Join AI Stylist to discover your perfect style'}</p>
          </div>
          
          <form className="auth-form" onSubmit={handleFormSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name" 
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="form-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email" 
                required 
              />
            </div>
            
            <div className="form-group password-group">
              <label>Password</label>
              <div className="password-input-container">
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password" 
                  required 
                />
                <button 
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
            
            {!isLogin && (
              <div className="form-group password-group">
                <label>Confirm Password</label>
                <div className="password-input-container">
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password" 
                    required={!isLogin}
                  />
                  <button 
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>
            )}
            
            {isLogin && (
              <div className="form-options">
                <label className="checkbox">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <a href="#" className="forgot-password" onClick={handleForgotPassword}>
                  Forgot password?
                </a>
              </div>
            )}
            
            <button type="submit" className="btn btn-primary auth-btn">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          
          <div className="auth-divider">
            <span>or continue with</span>
          </div>
          
          {/* <div className="social-auth">
            <button type="button" className="social-btn google-btn">
              <i className="fab fa-google"></i>
              Google
            </button>
            <button type="button" className="social-btn facebook-btn">
              <i className="fab fa-facebook-f"></i>
              Facebook
            </button>
          </div> */}

         <div className="social-auth">
  <GoogleLogin
    onSuccess={async (credentialResponse) => {
      console.log("Google Token:", credentialResponse.credential);
      
      // ✅ Send token to backend for verification
      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important for cookies
        body: JSON.stringify({ token: credentialResponse.credential }),
      });

      const data = await res.json();
      alert(data.message);
    }}
    onError={() => {
      console.log("Google Login Failed");
    }}
  />
</div>

          
          <div className="auth-switch">
            <p>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                className="switch-btn"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
        
        <div className="auth-hero">
          <div className="auth-hero-content">
            <h3>Your Personal AI Stylist Awaits</h3>
            <p>Join thousands of users who have discovered their perfect style with AI-powered recommendations</p>
            <div className="auth-features">
              <div className="auth-feature">
                <i className="fas fa-robot"></i>
                <span>AI-Powered Styling</span>
              </div>
              <div className="auth-feature">
                <i className="fas fa-camera"></i>
                <span>Photo Analysis</span>
              </div>
              <div className="auth-feature">
                <i className="fas fa-save"></i>
                <span>Save Your Looks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;