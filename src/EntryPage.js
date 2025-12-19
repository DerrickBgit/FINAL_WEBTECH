import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RotatingText from './components/RotatingText';
import LoadingScreen from './LoadingScreen';
import './EntryPage.css';

export default function EntryPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingScreen key="loading" background="#ffffff" />
      ) : (
        <motion.div
          key="entry"
          className="entry-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
      <motion.header 
        className="entry-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="entry-header-content">
          <div className="entry-logo">
            <div className="logo-wrapper">
              <Package size={32} className="logo-icon" />
            </div>
            <h2>IMS</h2>
          </div>
          <div className="header-actions">
            <Link to="/login" className="entry-login-button">
              Login
            </Link>
            <button onClick={handleGetStarted} className="entry-header-button">
              Get Started
            </button>
          </div>
        </div>
      </motion.header>

      <motion.div 
        className="entry-main-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <div className="entry-content-left">
          <motion.h1 
            className="entry-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <motion.span 
              className="entry-title-line1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              Welcome to
            </motion.span>
            <motion.span 
              className="entry-title-line2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              Inventory Management System
            </motion.span>
          </motion.h1>
          <motion.div 
            className="rotating-text-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
          >
            <span className="static-word">Effective </span>
            <RotatingText
              texts={['storage', 'tracking', 'forecasting']}
              splitBy="characters"
              rotationInterval={3000}
              staggerDuration={0.05}
              staggerFrom="first"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-120%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            />
          </motion.div>
        </div>
        <motion.div 
          className="entry-content-right"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <motion.img 
            src="/assets/inventory-illustration.png" 
            alt="Inventory Management Illustration" 
            className="entry-illustration"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.7 }}
          />
        </motion.div>
      </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
