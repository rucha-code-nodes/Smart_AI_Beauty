import React, { useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Hero from '../components/Hero/Hero';
import UploadSection from '../components/UploadSection/UploadSection';
import ChatSection from '../components/ChatSection/ChatSection';
import SavedLooks from '../components/SavedLooks/SavedLooks';
import Features from '../components/Features/Features';
import Footer from '../components/Footer/Footer';
import BackToTop from '../components/BackToTop/BackToTop';

const Home = () => {
  useEffect(() => {
    // Add Font Awesome
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(link);

    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section').forEach(section => {
      observer.observe(section);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="home">
      <Navbar />
      <Hero />
      <UploadSection />
      <ChatSection />
      <SavedLooks />
      <Features />
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Home;