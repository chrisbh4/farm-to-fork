import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { signUp } from '../../store/session';
import './auth.css'

const SignUpForm = ({ onClose }) => {
  const [errors, setErrors] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();
    
    if (password === repeatPassword) {
      setIsLoading(true);
      setErrors([]);
      
      const data = await dispatch(signUp(username, email, password));
      if (data) {
        setErrors(data);
      } else {
        // Close modal on successful signup
        if (onClose) onClose();
      }
      setIsLoading(false);
    } else {
      setErrors(['Confirm Password field must match the Password field']);
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const updateRepeatPassword = (e) => {
    setRepeatPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <div className="auth-modal">
      <div className="auth-header">
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Join our community of local farmers and fresh food lovers</p>
      </div>

      <form onSubmit={onSignUp} className="auth-form">
        {/* Username Field */}
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <div className="form-input-container">
            <i className="fas fa-user form-input-icon"></i>
            <input
              id="username"
              name="username"
              type="text"
              className={`form-input ${errors?.username ? 'form-input-error' : ''}`}
              placeholder="Choose a username"
              value={username}
              onChange={updateUsername}
              required
              disabled={isLoading}
            />
          </div>
          {errors?.username && (
            <p className="form-error">
              <i className="fas fa-exclamation-circle"></i>
              {errors.username}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <div className="form-input-container">
            <i className="fas fa-envelope form-input-icon"></i>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-input ${errors?.email ? 'form-input-error' : ''}`}
              placeholder="Enter your email"
              value={email}
              onChange={updateEmail}
              required
              disabled={isLoading}
            />
          </div>
          {errors?.email && (
            <p className="form-error">
              <i className="fas fa-exclamation-circle"></i>
              {errors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <div className="form-input-container">
            <i className="fas fa-lock form-input-icon"></i>
            <input
              id="password"
              name="password"
              type="password"
              className={`form-input ${errors?.password ? 'form-input-error' : ''}`}
              placeholder="Create a password"
              value={password}
              onChange={updatePassword}
              required
              disabled={isLoading}
            />
          </div>
          {errors?.password && (
            <p className="form-error">
              <i className="fas fa-exclamation-circle"></i>
              {errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="form-group">
          <label htmlFor="repeatPassword" className="form-label">
            Confirm Password
          </label>
          <div className="form-input-container">
            <i className="fas fa-lock form-input-icon"></i>
            <input
              id="repeatPassword"
              name="repeatPassword"
              type="password"
              className={`form-input ${errors?.passMatch ? 'form-input-error' : ''}`}
              placeholder="Confirm your password"
              value={repeatPassword}
              onChange={updateRepeatPassword}
              required
              disabled={isLoading}
            />
          </div>
          {errors?.passMatch && (
            <p className="form-error">
              <i className="fas fa-exclamation-circle"></i>
              {errors.passMatch}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="auth-actions">
          <button 
            type="submit" 
            className="btn btn-primary btn-lg auth-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Creating account...
              </>
            ) : (
              <>
                <i className="fas fa-user-plus"></i>
                Create Account
              </>
            )}
          </button>
        </div>

        {/* Terms and Conditions */}
        <div className="auth-terms">
          <p className="auth-terms-text">
            By creating an account, you agree to our{' '}
            <button type="button" className="auth-link-btn">Terms of Service</button>{' '}
            and{' '}
            <button type="button" className="auth-link-btn">Privacy Policy</button>
          </p>
        </div>
      </form>

      <div className="auth-footer">
        <p className="auth-footer-text">
          Already have an account? 
          <button className="auth-link-btn">Sign in instead</button>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
