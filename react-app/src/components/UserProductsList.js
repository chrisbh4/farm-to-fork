import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Modal } from '../context/Modal';
import ProductModal from './Products/ProductModal';
import './UserProductsList.css';

const UserProductsList = ({ userId }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const currentUser = useSelector(state => state.session.user);
  
  // Check if current user can manage these products
  const canManage = currentUser && currentUser.id === parseInt(userId);

  useEffect(() => {
    const fetchUserProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/users/${userId}/products`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        } else {
          setError('Failed to load products');
        }
      } catch (err) {
        setError('Network error while loading products');
        console.error('Error fetching user products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserProducts();
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className="user-products-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-products-error">
        <i className="fas fa-exclamation-triangle"></i>
        <p>{error}</p>
        <button 
          className="btn btn-secondary btn-sm"
          onClick={() => window.location.reload()}
        >
          <i className="fas fa-refresh"></i>
          Try Again
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="user-products-empty">
        <div className="empty-state">
          <i className="fas fa-seedling"></i>
          <h3>{canManage ? "You haven't listed any products yet" : "No products listed yet"}</h3>
          <p>
            {canManage 
              ? "Start sharing your fresh produce with the community!"
              : "This farmer hasn't added any products to their store yet."
            }
          </p>
          {canManage && (
            <Link to="/products/create" className="btn btn-primary btn-lg">
              <i className="fas fa-plus"></i>
              List Your First Product
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="user-products-container">
      <div className="user-products-header">
        <div className="products-count">
          <span className="count-number">{products.length}</span>
          <span className="count-label">Product{products.length !== 1 ? 's' : ''} Listed</span>
        </div>
        {canManage && (
          <Link to="/products/create" className="btn btn-primary">
            <i className="fas fa-plus"></i>
            Add New Product
          </Link>
        )}
      </div>

      <div className="user-products-grid">
        {products.map(product => (
          <UserProductCard 
            key={product.id} 
            product={product} 
            canManage={canManage}
            onViewDetails={(product) => {
              setSelectedProduct(product);
              setShowProductModal(true);
            }}
          />
        ))}
      </div>

      {/* Product Modal */}
      {showProductModal && selectedProduct && (
        <Modal onClose={() => {
          setShowProductModal(false);
          setSelectedProduct(null);
        }}>
          <ProductModal 
            product={selectedProduct}
            userId={currentUser?.id}
            setShowProductModal={setShowProductModal}
          />
        </Modal>
      )}
    </div>
  );
};

const UserProductCard = ({ product, canManage, onViewDetails }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="user-product-card">
      <div className="product-image-container">
        <img 
          src={product.image || '/placeholder-product.jpg'} 
          alt={product.name}
          className="product-image"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200/f3f4f6/9ca3af?text=No+Image';
          }}
        />
        {/* <div className="product-type-badge">
          <i className="fas fa-tag"></i>
          {product.product_type}
        </div> */}
        {canManage && (
          <div className="product-actions-overlay">
            <Link 
              to={`/products/${product.id}/edit`}
              className="action-btn edit-btn"
              title="Edit Product"
            >
              <i className="fas fa-edit"></i>
            </Link>
            <button 
              className="action-btn view-btn"
              title="View Details"
              onClick={() => onViewDetails(product)}
            >
              <i className="fas fa-eye"></i>
            </button>
          </div>
        )}
      </div>

      <div className="product-content">
        <div className="product-header">
          <h3 className="product-name">
            <button 
              className="product-name-link"
              onClick={() => onViewDetails(product)}
            >
              {product.name}
            </button>
          </h3>
          <span className="product-price">{formatPrice(product.price)}</span>
        </div>

        <p className="product-description">
          {product.description.length > 100 
            ? `${product.description.substring(0, 100)}...`
            : product.description
          }
        </p>
        <div className="product-meta">
          <div className="meta-item">
            <i className="fas fa-calendar-alt"></i>
            <span>Listed {formatDate(product.created_at)}</span>
          </div>
          
          <div className="meta-item">
          <i className="fas fa-tag"></i>
          {product.product_type}
          </div>
        </div>

        <div className="product-footer">
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => onViewDetails(product)}
          >
            <i className="fas fa-eye"></i>
            View Details
          </button>
          {canManage && (
            <Link 
              to={`/products/${product.id}/edit`}
              className="btn btn-secondary btn-sm"
            >
              <i className="fas fa-edit"></i>
              Edit
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProductsList; 