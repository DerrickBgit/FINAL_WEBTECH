import React from "react";
import { Package } from "lucide-react";

export default function LoadingScreen({ background = '#0f172a' }) {
  return (
    <div className="loading-container">
      <div className="logo-wrapper">
        <Package size={80} className="logo-icon" />
        <div className="pulse-ring"></div>
      </div>

      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .loading-container {
          height: 100vh;
          background: ${background};
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          width: 100vw;
          z-index: 10;
        }

        .logo-wrapper {
          position: relative;
        }

        .logo-icon {
          color: #60a5fa;
          animation: float 2s ease-in-out infinite;
          filter: drop-shadow(0 0 20px rgba(96, 165, 250, 0.6));
        }

        .pulse-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(96, 165, 250, 0.3), transparent 70%);
          animation: pulse 1.5s ease-out infinite;
        }


        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        @keyframes pulse {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.6);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
