import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';
import Iridescence from './iridescence.jsx';
import SplitText from './SplitText';
import './WelcomeLanding.css';

export default function WelcomeLanding() {
  const navigate = useNavigate();
  const [showButtons, setShowButtons] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <div className="welcome-landing-wrapper">
      <Iridescence
        color={[0.4, 0.7, 1.0]}
        speed={1.2}
        amplitude={0.25}
        mouseReact={true}
        className="shader-bg"
      />
      
      <div className="welcome-landing-container">
        <div className="logo-container">
          <Package className="logo-icon" size={64} />
        </div>

        <div className="text-content">
          <SplitText
            text="Welcome to Inventory Management"
            tag="h1"
            className="main-title"
            delay={50}
            duration={0.8}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 50 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0}
            rootMargin="-50px"
            textAlign="center"
          />
          
          <SplitText
            text="Empowering businesses to track, manage, and optimize their inventory with precision"
            tag="p"
            className="subtitle"
            delay={80}
            duration={0.6}
            ease="power2.out"
            splitType="words"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0}
            rootMargin="-50px"
            textAlign="center"
          />
        </div>

        <div className={`cta-section ${showButtons ? 'visible' : ''}`}>
          <button onClick={handleGetStarted} className="cta-button">
            <span>Get Started</span>
            <ArrowRight size={20} />
            <div className="button-shine"></div>
          </button>
          <Link to="/login" className="login-link">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}

