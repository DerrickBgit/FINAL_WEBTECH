import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import { Package, Box, BarChart3, Home, UserCircle } from 'lucide-react';
import './Layout.css';

export default function Layout() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getDisplayName = () => {
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase();
    }
    if (user?.email) {
      const emailName = user.email.split('@')[0];
      return emailName.charAt(0).toUpperCase() + emailName.slice(1).toLowerCase();
    }
    return 'there';
  };

  const displayName = getDisplayName();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout-wrapper">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Package size={32} className="logo-icon" />
          <h1>IMS</h1>
        </div>
        
        <nav className="sidebar-nav">
          <Link 
            to="/dashboard"
            className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <Home size={20} />
            <span className="nav-text">Dashboard</span>
          </Link>
          <Link 
            to="/inventory"
            className={`nav-item ${isActive('/inventory') ? 'active' : ''}`}
          >
            <Box size={20} />
            <span className="nav-text">Inventory</span>
          </Link>
          <Link 
            to="/forecasts"
            className={`nav-item ${isActive('/forecasts') ? 'active' : ''}`}
          >
            <BarChart3 size={20} />
            <span className="nav-text">Forecasts</span>
          </Link>
          <Link 
            to="/profile"
            className={`nav-item ${isActive('/profile') ? 'active' : ''}`}
          >
            <UserCircle size={20} />
            <span className="nav-text">Profile</span>
          </Link>
        </nav>
      </aside>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

