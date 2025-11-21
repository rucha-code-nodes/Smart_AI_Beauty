import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="container">
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
        <Link to="/" className="logo">
          <i className="fas fa-star"></i>AI Stylist
        </Link>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#upload">Try It</a>
          <a href="#chat">Chat Stylist</a>
          <a href="#saved">My Looks</a>
          <a href="#features">How It Works</a>
        </div>
        <div className="nav-buttons">
          <Link to="/signup" className="btn btn-secondary">Sign In</Link>
          <a href="#upload" className="btn btn-primary">Upload Photo</a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;