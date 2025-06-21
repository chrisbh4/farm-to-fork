import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom';
import { fetchEditProduct, fetchDeleteProduct } from '../../store/products';
import { useRemoveItem } from '../../store/shoppingCart';
import './ProductForms.css'

const ProductEditForm = () => {
  const params = useParams();
  const productId = params.id;
  const product = useSelector((state) => state.products[productId]);
  const cart = useSelector(state => state.shoppingCart);
  const removeItem = useRemoveItem(productId, cart);

  const [errors, setErrors] = useState({});
  const [name, setName] = useState(product?.name || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price || '');
  const [quantity] = useState(product?.quantity || 1);
  const [image, setImage] = useState(product?.image || '');
  const [productType, setProductType] = useState(product?.product_type || 'Vegetables');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();

  const PRODUCT_TYPES = [
    { value: 'Vegetables', label: 'Vegetables' },
    { value: 'Fruits', label: 'Fruits' },
    { value: 'Herbs', label: 'Herbs' }
  ];

  // Redirect if product not found
  if (!product) {
    history.push('/');
    return null;
  }

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

    if (!productType) newErrors.productType = 'Product type is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const data = await dispatch(fetchEditProduct(product.id, name, description, parseFloat(price), quantity, image, productType));
      
      if (data) {
        if (!data.errors) {
          history.push('/products');
        } else {
          setErrors(data.errors);
        }
      }
    } catch (error) {
      setErrors({ general: 'An error occurred while updating the product. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    
    try {
      removeItem();
      await dispatch(fetchDeleteProduct(product.id));
      history.push('/');
    } catch (error) {
      setErrors({ general: 'An error occurred while deleting the product. Please try again.' });
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
            <i className="fas fa-edit"></i>
            Edit Product
          </h1>
          <p className="product-form-subtitle">
            Update your product information
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

          {/* Product Type */}
          <div className="form-group">
            <label htmlFor="productType" className="form-label">
              Product Type <span className="required">*</span>
            </label>
            <select
              id="productType"
              className={`form-select ${errors.productType ? 'form-input-error' : ''}`}
              value={productType}
              onChange={(e) => setProductType(e.target.value)}
              disabled={isLoading}
            >
              {PRODUCT_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.productType && (
              <p className="form-error">
                <i className="fas fa-exclamation-circle"></i>
                {errors.productType}
              </p>
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
                  Updating...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Update Product
                </>
              )}
            </button>
          </div>

          {/* Danger Zone */}
          <div className="danger-zone">
            <div className="danger-zone-header">
              <h3 className="danger-zone-title">
                <i className="fas fa-exclamation-triangle"></i>
                Danger Zone
              </h3>
              <p className="danger-zone-subtitle">
                This action cannot be undone. Please be certain.
              </p>
            </div>
            
            {!showDeleteConfirm ? (
              <button
                type="button"
                className="btn btn-danger btn-lg"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isLoading}
              >
                <i className="fas fa-trash"></i>
                Delete Product
              </button>
            ) : (
              <div className="delete-confirmation">
                <p className="delete-confirmation-text">
                  Are you sure you want to delete this product? This action cannot be undone.
                </p>
                <div className="delete-confirmation-actions">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={handleDelete}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-trash"></i>
                        Yes, Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditForm;
