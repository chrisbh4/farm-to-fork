import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { authenticate } from '../store/session';
import './UserEditForm.css';

const UserEditForm = ({ user, onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    username: user.username || '',
    email: user.email || '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 40) {
      newErrors.username = 'Username must be less than 40 characters';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Password validation (only if password is provided)
    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const updateData = {
        username: formData.username,
        email: formData.email
      };
      
      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Update the session with new user data
        await dispatch(authenticate());
        onSave(data);
      } else {
        setErrors(data.errors || { general: 'An error occurred while updating your profile' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-edit-form-container">
      <div className="user-edit-form-header">
        <h2 className="user-edit-form-title">
          <i className="fas fa-user-edit"></i>
          Edit Profile
        </h2>
        <p className="user-edit-form-subtitle">
          Update your account information
        </p>
      </div>

      <form onSubmit={handleSubmit} className="user-edit-form">
        {/* General Error */}
        {errors.general && (
          <div className="form-error-banner">
            <i className="fas fa-exclamation-triangle"></i>
            {errors.general}
          </div>
        )}

        {/* Username Field */}
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username <span className="required">*</span>
          </label>
          <div className="form-input-container">
            <i className="fas fa-user form-input-icon"></i>
            <input
              id="username"
              name="username"
              type="text"
              className={`form-input ${errors.username ? 'form-input-error' : ''}`}
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={isLoading}
              maxLength={40}
            />
          </div>
          {errors.username && (
            <p className="form-error">
              <i className="fas fa-exclamation-circle"></i>
              {errors.username}
            </p>
          )}
          <p className="form-help-text">
            {formData.username.length}/40 characters
          </p>
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address <span className="required">*</span>
          </label>
          <div className="form-input-container">
            <i className="fas fa-envelope form-input-icon"></i>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-input ${errors.email ? 'form-input-error' : ''}`}
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="form-error">
              <i className="fas fa-exclamation-circle"></i>
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Section */}
        <div className="form-section">
          <h3 className="form-section-title">
            <i className="fas fa-lock"></i>
            Change Password (Optional)
          </h3>
          <p className="form-section-subtitle">
            Leave blank to keep your current password
          </p>

          {/* New Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
              New Password
            </label>
            <div className="form-input-container">
              <i className="fas fa-key form-input-icon"></i>
              <input
                id="password"
                name="password"
                type="password"
                className={`form-input ${errors.password ? 'form-input-error' : ''}`}
                placeholder="Enter new password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            {errors.password && (
              <p className="form-error">
                <i className="fas fa-exclamation-circle"></i>
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm New Password
            </label>
            <div className="form-input-container">
              <i className="fas fa-key form-input-icon"></i>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className={`form-input ${errors.confirmPassword ? 'form-input-error' : ''}`}
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>
            {errors.confirmPassword && (
              <p className="form-error">
                <i className="fas fa-exclamation-circle"></i>
                {errors.confirmPassword}
              </p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={onCancel}
            disabled={isLoading}
          >
            <i className="fas fa-times"></i>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserEditForm; 