import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Package, Lock, Mail, ArrowRight } from 'lucide-react';
import LoadingScreen from './LoadingScreen';
import Iridescence from './iridescence.jsx';
import './Login.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/welcome');
    } catch (err) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="login-wrapper">
      <Iridescence
        color={[0.3, 0.6, 1.0]}
        speed={1.2}
        amplitude={0.15}
        mouseReact={false}
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
              Welcome Back
              <span className="gradient-text">Login</span>
            </h1>

            <form className="login-form" onSubmit={handleLogin}>
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              <div className="input-group">
                <Mail size={18} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoggingIn}
                />
              </div>

              <div className="input-group">
                <Lock size={18} />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoggingIn}
                />
              </div>

              <button type="submit" className="login-button" disabled={isLoggingIn}>
                <span>{isLoggingIn ? 'Logging in...' : 'Login'}</span>
                {!isLoggingIn && <ArrowRight size={18} />}
                <div className="button-shine"></div>
              </button>
            </form>

            <p className="footer-text">
              Don't have an account?{' '}
              <Link to="/signup" className="link-text">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}