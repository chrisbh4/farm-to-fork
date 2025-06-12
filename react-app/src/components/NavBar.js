import React from 'react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LogoutButton from './auth/LogoutButton';
import './NavBar.css'
import { Modal } from '../context/Modal'
import LoginForm from './auth/LoginForm';
import SignUpForm from './auth/SignUpForm'
import ShoppingCart from './Cart/ShoppingCart';
import { login, logout } from '../store/session';

const NavBar = () => {
  const user = useSelector(state => state.session.user);
  const cartItems = useSelector(state => state.shoppingCart);
  const dispatch = useDispatch();
  const [optionsOn, setOptionsOn] = useState(false);
  const [cart, setCart] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Calculate total items in cart
  const cartItemCount = Object.values(cartItems).reduce((total, item) => total + (item.quantity || 0), 0);

  const handleDemoLogin = async () => {
    await dispatch(login('demo@aa.io', 'password'));
  };

  return (
    <>
      {/* Main Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          {/* Left Section - Logo & Menu */}
          <div className="navbar-left">
            <button 
              className="navbar-menu-btn"
              onClick={() => setOptionsOn(!optionsOn)}
              aria-label="Open menu"
            >
              <i className="fas fa-bars" />
            </button>
            
            <NavLink to='/' exact={true} className="navbar-logo-link">
              <div className="navbar-logo">
                <img 
                  className="navbar-logo-img" 
                  src={require("../assets/logos/batteriesinc-logo.svg").default}
                  alt="BatteriesInc Logo"
                />
                <span className="navbar-brand-text">BatteriesInc</span>
              </div>
            </NavLink>
          </div>

          {/* Center Section - Search (Future Feature) */}
          <div className="navbar-center">
            <div className="navbar-search">
              <i className="fas fa-search navbar-search-icon"></i>
              <input 
                type="text" 
                placeholder="Search fresh produce..." 
                className="navbar-search-input"
                disabled
              />
            </div>
          </div>

          {/* Right Section - User Actions */}
          <div className="navbar-right">
            {user ? (
              <>
                <Link to="/products/create" className="btn btn-outline btn-sm">
                  <i className="fas fa-plus"></i>
                  Sell Produce
                </Link>
                
                <button 
                  className="navbar-cart-btn"
                  onClick={() => setCart(!cart)}
                  aria-label="Shopping cart"
                >
                  <i className="fas fa-shopping-cart"></i>
                  {cartItemCount > 0 && (
                    <span className="navbar-cart-badge">{cartItemCount}</span>
                  )}
                </button>

                {/* User Menu with Dropdown */}
                <div className="navbar-user-menu-container">
                  <button 
                    className="navbar-user-menu"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    aria-label="User menu"
                  >
                    <img 
                      src={`https://ui-avatars.com/api/?name=${user.username}&background=16a34a&color=fff`}
                      alt={user.username}
                      className="navbar-user-avatar"
                    />
                    <span className="navbar-user-name">{user.username}</span>
                    <i className={`fas fa-chevron-${showUserDropdown ? 'up' : 'down'} navbar-user-chevron`}></i>
                  </button>

                  {/* User Dropdown Menu */}
                  {showUserDropdown && (
                    <div className="navbar-user-dropdown">
                      <div className="navbar-user-dropdown-header">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${user.username}&background=16a34a&color=fff`}
                          alt={user.username}
                          className="navbar-user-dropdown-avatar"
                        />
                        <div className="navbar-user-dropdown-info">
                          <span className="navbar-user-dropdown-name">{user.username}</span>
                          <span className="navbar-user-dropdown-email">{user.email}</span>
                        </div>
                      </div>
                      
                      <div className="navbar-user-dropdown-divider"></div>
                      
                      <div className="navbar-user-dropdown-menu">
                        <Link 
                          to={`/users/${user.id}`} 
                          className="navbar-user-dropdown-item"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <i className="fas fa-user"></i>
                          My Profile
                        </Link>
                        <Link 
                          to="/products/create" 
                          className="navbar-user-dropdown-item"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <i className="fas fa-plus"></i>
                          Create Listing
                        </Link>
                        <div className="navbar-user-dropdown-item navbar-user-dropdown-item-disabled">
                          <i className="fas fa-heart"></i>
                          Favorites (Soon)
                        </div>
                        <div className="navbar-user-dropdown-item navbar-user-dropdown-item-disabled">
                          <i className="fas fa-history"></i>
                          Order History (Soon)
                        </div>
                      </div>
                      
                      <div className="navbar-user-dropdown-divider"></div>
                      
                      <div className="navbar-user-dropdown-footer">
                        <LogoutButton 
                          setCart={setCart} 
                          cart={cart} 
                          setShowLoginModal={setShowLoginModal} 
                          setShowSignUpModal={setShowSignUpModal}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Direct Logout Button for Quick Access */}
                <button 
                  className="btn btn-ghost btn-sm navbar-logout-btn"
                  onClick={() => {
                    setCart(false);
                    dispatch(logout());
                  }}
                  title="Log out"
                >
                  <i className="fas fa-sign-out-alt"></i>
                  <span className="navbar-logout-text">Logout</span>
                </button>
              </>
            ) : (
              <div className="navbar-auth-buttons">
                <button 
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowLoginModal(true)}
                >
                  Log In
                </button>
                <button 
                  className="btn btn-demo btn-sm"
                  onClick={handleDemoLogin}
                  title="Try the app with a demo account"
                >
                  <i className="fas fa-play"></i>
                  Demo
                </button>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowSignUpModal(true)}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Dropdown Overlay */}
      {showUserDropdown && (
        <div 
          className="navbar-dropdown-overlay"
          onClick={() => setShowUserDropdown(false)}
        />
      )}

      {/* Mobile/Desktop Sidebar Menu */}
      <div className={`sidebar ${optionsOn ? 'sidebar-open' : ''}`}>
        <div className="sidebar-container">
          <div className="sidebar-header">
            <h3 className="sidebar-title">Menu</h3>
            <button 
              className="sidebar-close-btn"
              onClick={() => setOptionsOn(!optionsOn)}
              aria-label="Close menu"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="sidebar-content">
            {user ? (
              <div className="sidebar-user-section">
                <div className="sidebar-user-info">
                  <img 
                    src={`https://ui-avatars.com/api/?name=${user.username}&background=16a34a&color=fff`}
                    alt={user.username}
                    className="sidebar-user-avatar"
                  />
                  <div className="sidebar-user-details">
                    <h4 className="sidebar-user-name">Welcome, {user.username}!</h4>
                    <p className="sidebar-user-email">{user.email}</p>
                  </div>
                </div>

                <div className="sidebar-menu-items">
                  <Link 
                    to="/products/create" 
                    className="sidebar-menu-item"
                    onClick={() => setOptionsOn(false)}
                  >
                    <i className="fas fa-plus"></i>
                    Create New Listing
                  </Link>
                  
                  <Link 
                    to="/users" 
                    className="sidebar-menu-item"
                    onClick={() => setOptionsOn(false)}
                  >
                    <i className="fas fa-users"></i>
                    Browse Farmers
                  </Link>

                  <div className="sidebar-menu-item">
                    <i className="fas fa-heart"></i>
                    Favorites (Coming Soon)
                  </div>

                  <div className="sidebar-menu-item">
                    <i className="fas fa-history"></i>
                    Order History (Coming Soon)
                  </div>
                </div>

                <div className="sidebar-footer">
                  <LogoutButton 
                    setCart={setCart} 
                    cart={cart} 
                    setShowLoginModal={setShowLoginModal} 
                    setShowSignUpModal={setShowSignUpModal} 
                  />
                </div>
              </div>
            ) : (
              <div className="sidebar-guest-section">
                <div className="sidebar-guest-message">
                  <h4>Join SpudHub Today!</h4>
                  <p>Connect directly with local farmers and discover the freshest produce in your area.</p>
                </div>
                
                <div className="sidebar-auth-buttons">
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={() => {
                      setShowSignUpModal(true);
                      setOptionsOn(false);
                    }}
                  >
                    Sign Up Free
                  </button>
                  <button 
                    className="btn btn-demo btn-lg"
                    onClick={() => {
                      handleDemoLogin();
                      setOptionsOn(false);
                    }}
                    title="Try the app with a demo account"
                  >
                    <i className="fas fa-play"></i>
                    Try Demo
                  </button>
                  <button 
                    className="btn btn-secondary btn-lg"
                    onClick={() => {
                      setShowLoginModal(true);
                      setOptionsOn(false);
                    }}
                  >
                    Log In
                  </button>
                </div>

                <div className="sidebar-features">
                  <div className="sidebar-feature">
                    <i className="fas fa-leaf"></i>
                    <span>Fresh, Local Produce</span>
                  </div>
                  <div className="sidebar-feature">
                    <i className="fas fa-truck"></i>
                    <span>Direct from Farmers</span>
                  </div>
                  <div className="sidebar-feature">
                    <i className="fas fa-handshake"></i>
                    <span>Support Local Community</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shopping Cart Sidebar */}
      <div className={`cart-sidebar ${cart ? 'cart-sidebar-open' : ''}`}>
        <div className="cart-container">
          <div className="cart-header">
            <h3 className="cart-title">Your Cart</h3>
            <button 
              className="cart-close-btn"
              onClick={() => setCart(!cart)}
              aria-label="Close cart"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="cart-content">
            <ShoppingCart />
          </div>
        </div>
      </div>

      {/* Overlay for sidebars */}
      {(optionsOn || cart) && (
        <div 
          className="sidebar-overlay"
          onClick={() => {
            setOptionsOn(false);
            setCart(false);
          }}
        />
      )}

      {/* Modals */}
      {showLoginModal && (
        <Modal onClose={() => setShowLoginModal(false)}>
          <LoginForm onClose={() => setShowLoginModal(false)} />
        </Modal>
      )}

      {showSignUpModal && (
        <Modal onClose={() => setShowSignUpModal(false)}>
          <SignUpForm onClose={() => setShowSignUpModal(false)} />
        </Modal>
      )}
    </>
  );
};

export default NavBar;
