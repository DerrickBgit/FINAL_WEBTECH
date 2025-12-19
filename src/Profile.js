import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Shield, Edit2, Save, X, LogOut } from 'lucide-react';
import { api } from './utils/api';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setEditedUser({
        firstName: parsedUser.firstName || '',
        lastName: parsedUser.lastName || '',
        email: parsedUser.email || ''
      });
    }
    setIsLoading(false);
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedUser({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      const response = await api.updateUser(editedUser);
      const updatedUser = response.user;
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      alert(error.message || 'Failed to update profile');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getDisplayName = () => {
    if (user?.firstName) {
      return `${user.firstName} ${user.lastName || ''}`.trim();
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getInitials = () => {
    if (user?.firstName) {
      return `${user.firstName[0]}${user.lastName?.[0] || ''}`.toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className={`profile-wrapper ${isLoading ? 'loading' : ''}`}>
      <div className="profile-header">
        <div className="header-content">
        <div className="header-left">
          <h2>Profile</h2>
          </div>
          <div className="header-right">
            <button onClick={handleLogout} className="logout-button-header">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              <span className="avatar-initials">{getInitials()}</span>
            </div>
            <div className="profile-name-section">
              <h1>{getDisplayName()}</h1>
              <p className="profile-email">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="profile-details-card">
          <div className="card-header">
            <h3>Personal Information</h3>
            {!isEditing ? (
              <button onClick={handleEdit} className="edit-button">
                <Edit2 size={18} />
                Edit
              </button>
            ) : (
              <div className="edit-actions">
                <button onClick={handleCancel} className="cancel-button">
                  <X size={18} />
                  Cancel
                </button>
                <button onClick={handleSave} className="save-button">
                  <Save size={18} />
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="details-grid">
            <div className="detail-item">
              <div className="detail-label">
                <User size={18} />
                <span>First Name</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="firstName"
                  value={editedUser.firstName}
                  onChange={handleChange}
                  className="detail-input"
                  placeholder="Enter first name"
                />
              ) : (
                <div className="detail-value">
                  {user?.firstName || 'Not set'}
                </div>
              )}
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <User size={18} />
                <span>Last Name</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="lastName"
                  value={editedUser.lastName}
                  onChange={handleChange}
                  className="detail-input"
                  placeholder="Enter last name"
                />
              ) : (
                <div className="detail-value">
                  {user?.lastName || 'Not set'}
                </div>
              )}
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <Mail size={18} />
                <span>Email Address</span>
              </div>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleChange}
                  className="detail-input"
                  placeholder="Enter email"
                />
              ) : (
                <div className="detail-value">
                  {user?.email || 'Not set'}
                </div>
              )}
            </div>

            <div className="detail-item">
              <div className="detail-label">
                <Shield size={18} />
                <span>Role</span>
              </div>
              <div className="detail-value">
                <span className="role-badge">{user?.role || 'user'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-stats-card">
          <h3>Account Statistics</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <Calendar size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-label">Member Since</div>
                <div className="stat-value">
                  {user?.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })
                    : 'N/A'}
                </div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <Shield size={24} />
              </div>
              <div className="stat-info">
                <div className="stat-label">Account Status</div>
                <div className="stat-value status-active">Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



