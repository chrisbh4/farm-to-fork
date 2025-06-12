import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login } from '../../store/session';
import './auth.css'

const LoginForm = ({ onClose }) => {
  const [errors, setErrors] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);
    
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
      // Close modal on successful login
      if (onClose) onClose();
    }
    setIsLoading(false);
  };

  const onDemoLogin = async () => {
    setIsLoading(true);
    setErrors([]);
    
    const data = await dispatch(login('demo@aa.io', 'password'));
    if (!data) {
      // Close modal on successful demo login
      if (onClose) onClose();
    }
    setIsLoading(false);
  };

  const updateEmail = (e) => {
    setEmail(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  if (user) {
    return <Redirect to='/' />;
  }

  return (
    <div className="auth-modal">
      <div className="auth-header">
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to your account to continue</p>
      </div>

      <form onSubmit={onLogin} className="auth-form">
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
              placeholder="Enter your password"
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
                Signing in...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Sign In
              </>
            )}
          </button>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <button 
            type="button" 
            className="btn btn-demo btn-lg auth-demo-btn"
            onClick={onDemoLogin}
            disabled={isLoading}
          >
            <i className="fas fa-play"></i>
            Try Demo Account
          </button>
        </div>
      </form>

      <div className="auth-footer">
        <p className="auth-footer-text">
          New to BatteriesInc? 
          <button className="auth-link-btn">Create an account</button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
