import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { fetchCreateProduct } from '../../store/products';
import { useHistory } from 'react-router-dom';
import './ProductForms.css'

const ProductCreateForm = () => {
  const [errors, setErrors] = useState({});
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity] = useState(1);
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector(state => state.session.user);
  const user_id = user.id;
  const history = useHistory();
  const dispatch = useDispatch();

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Client-side validation
    const newErrors = {};
    
    if (!name.trim()) newErrors.name = 'Product name is required';
    if (name.length > 100) newErrors.name = 'Product name must be less than 100 characters';
    
    if (!description.trim()) newErrors.description = 'Description is required';
    if (description.length < 10) newErrors.description = 'Description must be at least 10 characters';
    
    if (!price || price <= 0) newErrors.price = 'Price must be greater than 0';
    if (price > 10000) newErrors.price = 'Price must be less than $10,000';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const data = await dispatch(fetchCreateProduct(user_id, name, description, parseFloat(price), quantity, image));

      if (data) {
        if (!data.errors) {
          history.push('/');
        } else {
          setErrors(data.errors);
        }
      }
    } catch (error) {
      setErrors({ general: 'An error occurred while creating the product. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-form-page">
      <div className="product-form-container">
        <div className="product-form-header">
          <button 
            className="btn btn-ghost btn-sm back-btn"
            onClick={() => history.goBack()}
            disabled={isLoading}
          >
            <i className="fas fa-arrow-left"></i>
            Back
          </button>
          <h1 className="product-form-title">
            <i className="fas fa-plus-circle"></i>
            Create New Product
          </h1>
          <p className="product-form-subtitle">
            Share your fresh produce with the community
          </p>
        </div>

        <form onSubmit={onSubmit} className="product-form">
          {/* General Error */}
          {errors.general && (
            <div className="form-error-banner">
              <i className="fas fa-exclamation-triangle"></i>
              {errors.general}
            </div>
          )}

          {/* Product Name */}
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Product Name <span className="required">*</span>
            </label>
            <div className="form-input-container">
              <i className="fas fa-seedling form-input-icon"></i>
              <input
                id="name"
                type="text"
                className={`form-input ${errors.name ? 'form-input-error' : ''}`}
                placeholder="e.g., Fresh Organic Tomatoes"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                maxLength={100}
              />
            </div>
            {errors.name && (
              <p className="form-error">
                <i className="fas fa-exclamation-circle"></i>
                {errors.name}
              </p>
            )}
            <p className="form-help-text">
              {name.length}/100 characters
            </p>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description <span className="required">*</span>
            </label>
            <div className="form-textarea-container">
              <textarea
                id="description"
                className={`form-textarea ${errors.description ? 'form-input-error' : ''}`}
                placeholder="Describe your product: origin, growing methods, flavor profile, freshness, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                rows={4}
                maxLength={500}
              />
            </div>
            {errors.description && (
              <p className="form-error">
                <i className="fas fa-exclamation-circle"></i>
                {errors.description}
              </p>
            )}
            <p className="form-help-text">
              {description.length}/500 characters (minimum 10)
            </p>
          </div>

          {/* Price */}
          <div className="form-group">
            <label htmlFor="price" className="form-label">
              Price per Unit <span className="required">*</span>
            </label>
            <div className="form-input-container price-input">
              <span className="price-symbol">$</span>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                max="10000"
                className={`form-input ${errors.price ? 'form-input-error' : ''}`}
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                disabled={isLoading}
              />
              <span className="price-unit">per lb</span>
            </div>
            {errors.price && (
              <p className="form-error">
                <i className="fas fa-exclamation-circle"></i>
                {errors.price}
              </p>
            )}
            <p className="form-help-text">
              Set a competitive price for your fresh produce
            </p>
          </div>

          {/* Image URL */}
          <div className="form-group">
            <label htmlFor="image" className="form-label">
              Product Image URL
            </label>
            <div className="form-input-container">
              <i className="fas fa-image form-input-icon"></i>
              <input
                id="image"
                type="url"
                className="form-input"
                placeholder="https://example.com/your-product-image.jpg"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <p className="form-help-text">
              Optional: Add a URL to showcase your product (recommended for better sales)
            </p>
            
            {/* Image Preview */}
            {image && (
              <div className="image-preview">
                <p className="image-preview-label">Preview:</p>
                <img 
                  src={image} 
                  alt="Product preview" 
                  className="image-preview-img"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary btn-lg"
              onClick={() => history.goBack()}
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
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-plus"></i>
                  Create Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreateForm;
