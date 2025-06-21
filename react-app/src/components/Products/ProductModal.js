import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Product.css'
import { useSelector } from 'react-redux'
import { useAddItem } from '../../store/shoppingCart'
import { Modal } from '../../context/Modal'
import SignUpForm from '../auth/SignUpForm'
import LoginForm from '../auth/LoginForm'

const ProductModal = ({ product, userId, setEditMode, setShowProductModal }) => {
  const cart = useSelector(state => state.shoppingCart);
  const addItem = useAddItem(product, cart);
  const [imageError, setImageError] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 100) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await addItem(quantity);
    
    // Show success feedback briefly, then close modal
    setTimeout(() => {
      setIsAddingToCart(false);
      if (setShowProductModal) {
        setShowProductModal(false);
      }
    }, 800);
  };

  const isOwner = userId === product.user_id;
  const hasImage = product.image && !imageError;

  return (
    <div className="product-modal-container">
      {/* Product Header */}
      <div className="product-modal-header">
        <div className="product-modal-badge">
          <i className="fas fa-leaf"></i>
          <span>Fresh & Local</span>
        </div>
        
        {isOwner && (
          <Link 
            to={`/products/${product.id}/edit`}
            className="product-modal-edit-btn"
            onClick={() => setEditMode(true)}
          >
            <i className="fas fa-edit"></i>
            Edit Product
          </Link>
        )}
      </div>

      {/* Main Content */}
      <div className="product-modal-content">
        {/* Product Image */}
        <div className="product-modal-image-section">
          <div className="product-modal-image-container">
            <img 
              src={hasImage ? product.image : 'https://i.imgur.com/BPOYKBx.png'} 
              alt={product.name}
              className="product-modal-image"
              onError={() => setImageError(true)}
            />
            
            {hasImage && (
              <div className="product-modal-image-overlay">
                <button className="product-modal-zoom-btn" title="View full size">
                  <i className="fas fa-expand"></i>
                </button>
              </div>
            )}
          </div>
          
          <div className="product-modal-gallery-dots">
            <span className="gallery-dot active"></span>
          </div>
        </div>

        {/* Product Information */}
        <div className="product-modal-info-section">
          <div className="product-modal-info">
            <h1 className="product-modal-title">{product.name}</h1>
            
            <div className="product-modal-meta">
              <div className="product-modal-category">
                <i className="fas fa-tag"></i>
                <span>Organic Produce</span>
              </div>
              
              <div className="product-modal-freshness">
                <i className="fas fa-clock"></i>
                <span>Harvested Today</span>
              </div>
            </div>

            <div className="product-modal-price-section">
              <div className="product-modal-price">
                <span className="price-amount">${product.price.toFixed(2)}</span>
                <span className="price-unit">per lb</span>
              </div>
              
              <div className="product-modal-savings">
                <i className="fas fa-percentage"></i>
                <span>Save 30% vs. grocery stores</span>
              </div>
            </div>

            <div className="product-modal-description">
              <h3 className="description-title">
                <i className="fas fa-info-circle"></i>
                Product Description
              </h3>
              <p className="description-text">{product.description}</p>
            </div>

            <div className="product-modal-farmer-info">
              <div className="farmer-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="farmer-details">
                <h4 className="farmer-name">{product.username ? product.username.charAt(0).toUpperCase() + product.username.slice(1) : 'Local Farmer'}</h4>
                <p className="farmer-location">
                  <i className="fas fa-map-marker-alt"></i>
                  Farm-to-table freshness
                </p>
                <div className="farmer-rating">
                  <div className="stars">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </div>
                  <span className="rating-text">5.0 (128 reviews)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Section */}
          {userId && (
            <div className="product-modal-actions">
              <div className="quantity-selector">
                <label className="quantity-label">Quantity (lbs):</label>
                <div className="quantity-controls">
                  <button className="quantity-btn" onClick={() => handleQuantityChange(quantity - 1)}>
                    <i className="fas fa-minus"></i>
                  </button>
                  <span className="quantity-display">{quantity}</span>
                  <button className="quantity-btn" onClick={() => handleQuantityChange(quantity + 1)}>
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              </div>

              <button 
                className="product-modal-add-btn"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Adding...
                  </>
                ) : (
                  <>
                    <i className="fas fa-shopping-cart"></i>
                    Add to Cart - ${(product.price * quantity).toFixed(2)}
                  </>
                )}
              </button>

              <div className="product-modal-benefits">
                <div className="benefit-item">
                  <i className="fas fa-truck"></i>
                  <span>Free delivery on orders over $25</span>
                </div>
                <div className="benefit-item">
                  <i className="fas fa-shield-alt"></i>
                  <span>Freshness guaranteed or money back</span>
                </div>
                <div className="benefit-item">
                  <i className="fas fa-leaf"></i>
                  <span>Sustainably grown with organic practices</span>
                </div>
              </div>
            </div>
          )}

          {!userId && (
            <div className="product-modal-guest-cta">
              <div className="guest-cta-content">
                <h3 className="guest-cta-title">
                  <i className="fas fa-user-plus"></i>
                  Join to Purchase
                </h3>
                <p className="guest-cta-text">
                  Sign up or log in to add fresh produce to your cart and support local farmers.
                </p>
                <div className="guest-cta-buttons">
                  <button className="btn btn-primary btn-lg" onClick={() => setShowSignUpModal(true)}>
                    <i className="fas fa-user-plus"></i>
                    Sign Up Free
                  </button>
                  <button className="btn btn-secondary btn-lg" onClick={() => setShowLoginModal(true)}>
                    <i className="fas fa-sign-in-alt"></i>
                    Log In
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sign Up Modal */}
      {showSignUpModal && (
        <Modal onClose={() => setShowSignUpModal(false)}>
          <SignUpForm onClose={() => {
            setShowSignUpModal(false);
            if (setShowProductModal) {
              setShowProductModal(false);
            }
          }} />
        </Modal>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <Modal onClose={() => setShowLoginModal(false)}>
          <LoginForm onClose={() => {
            setShowLoginModal(false);
            if (setShowProductModal) {
              setShowProductModal(false);
            }
          }} />
        </Modal>
      )}
    </div>
  );
};

export default ProductModal;
