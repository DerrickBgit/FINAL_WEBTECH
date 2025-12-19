import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import LoadingScreen from './LoadingScreen';
import './WelcomeScreen.css';

export default function WelcomeScreen() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (animationComplete) {
      const loadingTimer = setTimeout(() => {
        setShowLoading(true);
      }, 1500);

      return () => clearTimeout(loadingTimer);
    }
  }, [animationComplete]);

  useEffect(() => {
    if (showLoading) {
      const navigateTimer = setTimeout(() => {
        navigate('/dashboard');
      }, 2000); // Show loading screen for 2 seconds

      return () => clearTimeout(navigateTimer);
    }
  }, [showLoading, navigate]);

  if (!user) {
    return null;
  }

  const getDisplayName = () => {
    if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase();
    }
    if (user.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1).toLowerCase();
    }
    return 'there';
  };
  
  const firstName = getDisplayName();
  const words = `Hello, ${firstName}!`.split(' ');

  const handleLastWordComplete = () => {
    setAnimationComplete(true);
  };

  if (showLoading) {
    return <LoadingScreen background="#ffffff" />;
  }

  return (
    <div className="welcome-wrapper" ref={containerRef}>
      <div className="welcome-container">
        <div className="welcome-text">
          {words.map((word, index) => (
            <motion.span
              key={index}
              className="welcome-word"
              initial={{ filter: 'blur(10px)', opacity: 0, y: -50 }}
              animate={{ 
                filter: ['blur(10px)', 'blur(5px)', 'blur(0px)'],
                opacity: [0, 0.5, 1],
                y: [0, 0, 0]
              }}
              transition={{
                duration: 1.5,
                times: [0, 0.5, 1],
                delay: index * 0.3,
                ease: 'easeOut',
                onComplete: index === words.length - 1 ? handleLastWordComplete : undefined
              }}
            >
              {word}
              {index < words.length - 1 && '\u00A0'}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}

