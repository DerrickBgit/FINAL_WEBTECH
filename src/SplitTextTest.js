import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import SplitText from './SplitText';
import './SplitTextTest.css';

export default function SplitTextTest() {
  return (
    <div className="split-text-test-page">
      <div className="test-container">
        <Link to="/dashboard" className="back-button">
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>

        <div className="test-section">
          <SplitText
            text="SplitText Component Test"
            tag="h1"
            className="main-title"
            delay={50}
            duration={0.8}
            splitType="chars,words"
          />
        </div>

        <div className="test-section">
          <h2 className="section-title">Character Animation</h2>
          <SplitText
            text="This text animates character by character"
            tag="p"
            delay={30}
            duration={0.5}
            splitType="chars"
            className="test-text"
          />
        </div>

        <div className="test-section">
          <h2 className="section-title">Word Animation</h2>
          <SplitText
            text="This text animates word by word with a longer delay"
            tag="p"
            delay={100}
            duration={0.6}
            splitType="words"
            className="test-text"
          />
        </div>

        <div className="test-section">
          <h2 className="section-title">Line Animation</h2>
          <SplitText
            text="This is a longer text that will split into multiple lines. Each line will animate independently when it comes into view. This creates a nice cascading effect as you scroll down the page."
            tag="p"
            delay={80}
            duration={0.7}
            splitType="lines"
            className="test-text"
          />
        </div>

        <div className="test-section">
          <h2 className="section-title">Different Tags</h2>
          <SplitText
            text="This is an H2 heading"
            tag="h2"
            delay={40}
            duration={0.6}
            splitType="chars"
            className="test-heading"
          />
          <SplitText
            text="This is an H3 heading"
            tag="h3"
            delay={40}
            duration={0.6}
            splitType="chars"
            className="test-heading"
          />
        </div>

        <div className="test-section">
          <h2 className="section-title">Custom Animation</h2>
          <SplitText
            text="Custom from and to animations"
            tag="p"
            delay={50}
            duration={1}
            splitType="chars"
            from={{ opacity: 0, x: -50, rotation: -10 }}
            to={{ opacity: 1, x: 0, rotation: 0 }}
            className="test-text"
          />
        </div>
      </div>
    </div>
  );
}

