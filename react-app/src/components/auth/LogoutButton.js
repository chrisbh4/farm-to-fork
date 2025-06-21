import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { logout } from '../../store/session';
import { resetCart } from '../../store/shoppingCart';
import './auth.css'

const LogoutButton = ({ cart, setCart, setShowLoginModal, setShowSignUpModal }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  
  const onLogout = async (e) => {
    e.preventDefault();
    
    try {
      // Close any open modals/sidebars immediately
      setCart(false);
      setShowLoginModal(false);
      setShowSignUpModal(false);
      
      // If user is on a protected route, navigate away first
      const protectedRoutes = ['/products/create', '/products/edit', '/users'];
      const isOnProtectedRoute = protectedRoutes.some(route => 
        location.pathname.startsWith(route)
      );
      
      if (isOnProtectedRoute) {
        history.push('/');
        // Small delay to ensure navigation completes
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Clear the shopping cart
      dispatch(resetCart());
      
      // Perform logout
      await dispatch(logout());
      
      // Navigate to home if not already there
      if (location.pathname !== '/') {
        history.push('/');
      }
      
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: force navigation to home
      history.push('/');
    }
  };

  return <button className='logout-btn' onClick={onLogout}>Log out</button>;
};

export default LogoutButton;
