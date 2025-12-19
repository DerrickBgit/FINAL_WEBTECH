import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Lock, Mail, ArrowRight, User } from 'lucide-react';
import LoadingScreen from './LoadingScreen';
import Iridescence from './iridescence.jsx';
import './Login.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function SignupPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsSigningUp(true);

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Redirect to welcome screen on successful signup
      navigate('/welcome');
    } catch (err) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="login-wrapper">
      <Iridescence
        color={[0.3, 0.6, 1.0]}
        speed={1.2}
        amplitude={0.15}
        mouseReact={true}
        className="shader-bg"
      />

      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="login-container">
          <div className="login-card">
            <div className="logo-wrapper">
              <Package size={60} className="logo-icon" />
              <div className="logo-pulse"></div>
            </div>

            <h1 className="login-title">
              Create Your
              <span className="gradient-text">Account</span>
            </h1>

            <form className="login-form" onSubmit={handleSignup}>
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="input-group">
                <User size={18} />
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  disabled={isSigningUp}
                />
              </div>

              <div className="input-group">
                <User size={18} />
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  disabled={isSigningUp}
                />
              </div>

              <div className="input-group">
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSigningUp}
                />
              </div>

              <div className="input-group">
                <Lock size={18} />
                <input
                  type="password"
                  placeholder="Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSigningUp}
                  minLength={6}
                />
              </div>

              <div className="input-group">
                <Lock size={18} />
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isSigningUp}
                  minLength={6}
                />
              </div>

              <button type="submit" className="login-button" disabled={isSigningUp}>
                <span>{isSigningUp ? 'Creating Account...' : 'Sign Up'}</span>
                {!isSigningUp && <ArrowRight size={18} />}
                <div className="button-shine"></div>
              </button>
            </form>

            <p className="footer-text">
              Already have an account?{' '}
              <Link to="/login" className="link-text">
                Login here
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

