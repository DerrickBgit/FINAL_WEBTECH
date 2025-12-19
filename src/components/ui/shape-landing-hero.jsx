import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import './shape-landing-hero.css';

export function HeroGeometric({ 
  badge = "shadcn.io",
  title1 = "Elevate Your",
  title2 = "Digital Vision",
  description = "A custom shadcn registry with beautiful, reusable components for modern web development."
}) {
  return (
    <div className="hero-geometric-container">
      <div className="hero-shapes">
        <motion.div
          className="shape shape-1"
          initial={{ opacity: 0, scale: 0.8, x: -100 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: 0,
            y: [0, -20, 0],
          }}
          transition={{ 
            opacity: { duration: 0.6 },
            scale: { duration: 0.6 },
            x: { duration: 0.6 },
            y: { 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />
        <motion.div
          className="shape shape-2"
          initial={{ opacity: 0, scale: 0.8, x: 100 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: 0,
            y: [0, 20, 0],
          }}
          transition={{ 
            opacity: { duration: 0.6, delay: 0.2 },
            scale: { duration: 0.6, delay: 0.2 },
            x: { duration: 0.6, delay: 0.2 },
            y: { 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }
          }}
        />
        <motion.div
          className="shape shape-3"
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: 0,
            x: [0, 15, 0],
          }}
          transition={{ 
            opacity: { duration: 0.6, delay: 0.4 },
            scale: { duration: 0.6, delay: 0.4 },
            y: { duration: 0.6, delay: 0.4 },
            x: { 
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }
          }}
        />
        <motion.div
          className="shape shape-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            rotate: [0, 360],
          }}
          transition={{ 
            opacity: { duration: 0.6, delay: 0.6 },
            scale: { duration: 0.6, delay: 0.6 },
            rotate: { 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        />
      </div>

      <div className="hero-content">
        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {badge}
        </motion.div>

        <motion.div
          className="hero-icon-wrapper"
          initial={{ opacity: 0, scale: 0.8, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          <Package size={80} className="hero-icon" />
          <div className="hero-icon-pulse"></div>
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        >
          <motion.span 
            className="hero-title-line"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.4, ease: "easeOut" }}
          >
            {title1}
          </motion.span>
          <motion.span 
            className="hero-title-line hero-title-accent"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.0, delay: 0.7, ease: "easeOut" }}
          >
            {title2}
          </motion.span>
        </motion.h1>

        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 1.0, ease: "easeOut" }}
        >
          {description}
        </motion.p>
      </div>
    </div>
  );
}



