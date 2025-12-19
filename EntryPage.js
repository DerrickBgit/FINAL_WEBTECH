import React, { useState, useEffect } from 'react';
import { Package, ArrowRight, BarChart3, TrendingUp, Shield, Zap } from 'lucide-react';

export default function EntryPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: BarChart3, title: 'Real-Time Analytics', color: '#10b981' },
    { icon: TrendingUp, title: 'Smart Forecasting', color: '#3b82f6' },
    { icon: Shield, title: 'Secure & Reliable', color: '#8b5cf6' }
  ];

  const handleGetStarted = () => {
    alert('Redirecting to login...');
    // In real app: navigate to login page
  };

  return (
    <div className="entry-container">
      {/* Animated Background */}
      <div className="bg-animation">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      {/* Floating Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}></div>
        ))}
      </div>

      {/* Main Content */}
      <div className={`content ${isVisible ? 'visible' : ''}`}>
        {/* Logo Animation */}
        <div className="logo-container">
          <div className="logo-wrapper">
            <Package className="logo-icon" size={80} />
            <div className="logo-pulse"></div>
          </div>
        </div>

        {/* Title */}
        <h1 className="main-title">
          Inventory Management
          <span className="gradient-text">System</span>
        </h1>

        <p className="subtitle">
          Empowering businesses to track, manage, and optimize their inventory with precision
        </p>

        {/* Feature Carousel */}
        <div className="features-carousel">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`feature-card ${currentFeature === index ? 'active' : ''}`}
                style={{ '--feature-color': feature.color }}
              >
                <Icon size={32} />
                <span>{feature.title}</span>
              </div>
            );
          })}
        </div>

        {/* CTA Button */}
        <button onClick={handleGetStarted} className="cta-button">
          <span>Get Started</span>
          <ArrowRight size={20} />
          <div className="button-shine"></div>
        </button>

        {/* Stats */}
        <div className="stats">
          <div className="stat-item">
            <Zap size={20} />
            <div>
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
          </div>
          <div className="stat-item">
            <Package size={20} />
            <div>
              <div className="stat-number">10K+</div>
              <div className="stat-label">Products Tracked</div>
            </div>
          </div>
          <div className="stat-item">
            <TrendingUp size={20} />
            <div>
              <div className="stat-number">50%</div>
              <div className="stat-label">Efficiency Boost</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .entry-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          overflow: hidden;
          position: relative;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }

        /* Animated Background */
        .bg-animation {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .circle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
          animation: float 20s infinite ease-in-out;
        }

        .circle-1 {
          width: 500px;
          height: 500px;
          top: -250px;
          left: -250px;
          animation-delay: 0s;
        }

        .circle-2 {
          width: 400px;
          height: 400px;
          bottom: -200px;
          right: -200px;
          animation-delay: 7s;
        }

        .circle-3 {
          width: 600px;
          height: 600px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 14s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        /* Particles */
        .particles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          animation: rise linear infinite;
        }

        @keyframes rise {
          0% {
            bottom: -10px;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            bottom: 110vh;
            opacity: 0;
          }
        }

        /* Content */
        .content {
          position: relative;
          z-index: 10;
          text-align: center;
          max-width: 900px;
          opacity: 0;
          transform: translateY(30px);
          transition: all 1s ease-out;
        }

        .content.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Logo */
        .logo-container {
          margin-bottom: 40px;
        }

        .logo-wrapper {
          position: relative;
          display: inline-block;
        }

        .logo-icon {
          color: #60a5fa;
          filter: drop-shadow(0 0 30px rgba(96, 165, 250, 0.6));
          animation: logoFloat 3s ease-in-out infinite;
        }

        .logo-pulse {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(96, 165, 250, 0.3) 0%, transparent 70%);
          animation: pulse 2s ease-out infinite;
        }

        @keyframes logoFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }

        /* Title */
        .main-title {
          font-size: 3.5em;
          font-weight: 800;
          color: white;
          margin-bottom: 20px;
          line-height: 1.2;
        }

        .gradient-text {
          display: block;
          background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #ec4899 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 3s ease infinite;
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .subtitle {
          font-size: 1.2em;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 50px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Features Carousel */
        .features-carousel {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-bottom: 50px;
          flex-wrap: wrap;
        }

        .feature-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 24px;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 50px;
          color: white;
          font-weight: 600;
          transition: all 0.5s ease;
          opacity: 0.5;
          transform: scale(0.95);
        }

        .feature-card.active {
          opacity: 1;
          transform: scale(1.05);
          background: rgba(255, 255, 255, 0.1);
          border-color: var(--feature-color);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .feature-card.active svg {
          color: var(--feature-color);
          animation: bounce 0.5s ease;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        /* CTA Button */
        .cta-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 18px 40px;
          font-size: 1.1em;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
          border: none;
          border-radius: 50px;
          cursor: pointer;
          overflow: hidden;
          transition: all 0.3s ease;
          margin-bottom: 60px;
        }

        .cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(59, 130, 246, 0.4);
        }

        .cta-button:active {
          transform: translateY(-1px);
        }

        .button-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shine 3s infinite;
        }

        @keyframes shine {
          0% { left: -100%; }
          50%, 100% { left: 200%; }
        }

        /* Stats */
        .stats {
          display: flex;
          gap: 40px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
        }

        .stat-item svg {
          color: #60a5fa;
        }

        .stat-number {
          font-size: 1.5em;
          font-weight: 700;
          color: white;
        }

        .stat-label {
          font-size: 0.85em;
          color: rgba(255, 255, 255, 0.6);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .main-title {
            font-size: 2.5em;
          }

          .subtitle {
            font-size: 1em;
          }

          .features-carousel {
            flex-direction: column;
            gap: 12px;
          }

          .stats {
            flex-direction: column;
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
}