import React from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header/Header';
import Hero from '../components/Hero/Hero';
import UploadSection from '../components/UploadSection/UploadSection';
import ChatSection from '../components/ChatSection/ChatSection';
import SavedLooks from '../components/SavedLooks/SavedLooks';
import Features from '../components/Features/Features';
import Footer from '../components/Footer/Footer';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="dynamic-home">
      <Header />
      <Hero />
      <UploadSection />
      <ChatSection />
      <SavedLooks />
      <Features />
      <Footer />
    </div>
  );
};

export default Home;