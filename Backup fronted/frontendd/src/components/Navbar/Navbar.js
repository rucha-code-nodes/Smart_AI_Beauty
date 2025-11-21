import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const scrollToSection = (sectionId) => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const headerOffset = 100;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <header className="container">
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
        <Link to={currentUser ? "/dashboard" : "/"} className="logo">
          <i className="fas fa-star"></i>AI Stylist
        </Link>
        
        {currentUser ? (
          <div className="nav-links">
            <a href="#upload" onClick={(e) => { e.preventDefault(); scrollToSection('upload'); }}>
              Try It
            </a>
            <a href="#chat" onClick={(e) => { e.preventDefault(); scrollToSection('chat'); }}>
              Chat Stylist
            </a>
            <a href="#saved" onClick={(e) => { e.preventDefault(); scrollToSection('saved'); }}>
              My Looks
            </a>
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>
              How It Works
            </a>
          </div>
        ) : (
          <div className="nav-links">
            <Link to="/">Home</Link>
            <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a>
            <a href="#about">About</a>
          </div>
        )}

        <div className="nav-buttons">
          {currentUser ? (
            <>
              <span className="user-welcome">Welcome, {currentUser.name}</span>
              <button onClick={handleLogout} className="btn btn-secondary">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="btn btn-secondary">Sign In</Link>
              <Link to="/signup" className="btn btn-primary">Get Started</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;