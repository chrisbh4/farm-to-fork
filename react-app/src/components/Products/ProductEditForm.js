import React, { useState, useEffect, useRef } from 'react';
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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.image || '');
  const [productType, setProductType] = useState(product?.product_type || 'Vegetables');
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();
  const isMountedRef = useRef(true);

  // Cleanup function to prevent state updates on unmounted component
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const PRODUCT_TYPES = [
    { value: 'Vegetables', label: 'Vegetables' },
    { value: 'Fruits', label: 'Fruits' },
    { value: 'Herbs', label: 'Herbs' }
  ];

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)' }));
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image file must be less than 5MB' }));
        return;
      }

      // Clear previous preview (no cleanup needed for data URLs)

      setImageFile(file);
      setErrors(prev => ({ ...prev, image: '' }));

      // Create preview using FileReader
      const reader = new FileReader();
      
      reader.onload = (event) => {
        // Only update state if component is still mounted
        if (!isMountedRef.current) return;
        
        const result = event.target.result;
        
        // Validate the data URL
        if (result && result.startsWith('data:image/')) {
          setImagePreview(result);
        } else {
          setErrors(prev => ({ ...prev, image: 'Invalid image format' }));
        }
      };
      
      reader.onerror = () => {
        // Only update state if component is still mounted
        if (!isMountedRef.current) return;
        
        setErrors(prev => ({ ...prev, image: 'Failed to read file' }));
      };
      
      try {
        reader.readAsDataURL(file);
      } catch (error) {
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setErrors(prev => ({ ...prev, image: 'Failed to process file' }));
        }
      }
    } else {
      // Clear preview if no file selected
      setImageFile(null);
      setImagePreview(product?.image || '');
    }
  };

  // Redirect if product not found
  if (!product) {
    history.push('/');
    return null;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Enhanced client-side validation
    const newErrors = {};
    
    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Product name must be at least 2 characters';
    } else if (name.length > 100) {
      newErrors.name = 'Product name must be less than 100 characters';
    }
    
    // Description validation
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    } else if (description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    // Price validation
    if (!price) {
      newErrors.price = 'Price is required';
    } else {
      const priceNum = parseFloat(price);
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.price = 'Price must be a valid number greater than 0';
      } else if (priceNum > 10000) {
        newErrors.price = 'Price must be less than $10,000';
      } else if (priceNum < 0.01) {
        newErrors.price = 'Price must be at least $0.01';
      }
    }

    // Product type validation
    if (!productType) {
      newErrors.productType = 'Product type is required';
    }

    // Image validation (optional but if provided, must be valid)
    if (imageFile && !['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(imageFile.type)) {
      newErrors.image = 'Please select a valid image file';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('product_id', product.id);
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      formData.append('price', parseFloat(price));
      formData.append('quantity', quantity);
      formData.append('product_type', productType);
      
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (imagePreview && imagePreview !== product.image) {
        // If preview was cleared, send empty string to remove image
        formData.append('image', '');
      }

      const data = await dispatch(fetchEditProduct(product.id, formData));
      
      if (data) {
        if (!data.errors) {
          history.push(`/products?openModal=${product.id}`);
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

          {/* Image Upload */}
          <div className="form-group">
            <label htmlFor="image" className="form-label">
              Product Image
            </label>
            
            <div className="file-upload-container">
              <input
                id="image"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                className="file-input"
                onChange={handleFileChange}
                disabled={isLoading}
              />
              <label htmlFor="image" className={`file-upload-label ${errors.image ? 'file-upload-error' : ''}`}>
                <i className="fas fa-cloud-upload-alt"></i>
                <span className="file-upload-text">
                  {imageFile ? imageFile.name : 'Choose a new image or keep current'}
                </span>
                <span className="file-upload-subtext">
                  JPEG, PNG, GIF, WebP • Max 5MB
                </span>
              </label>
            </div>

            {errors.image && (
              <p className="form-error">
                <i className="fas fa-exclamation-circle"></i>
                {errors.image}
              </p>
            )}

            <p className="form-help-text">
              Upload a new image to replace the current one, or keep the existing image
            </p>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="image-preview">
                <div className="image-preview-header">
                  <p className="image-preview-label">
                    {imageFile ? 'New Image Preview:' : 'Current Image:'}
                  </p>
                  {imageFile && (
                    <button
                      type="button"
                      className="image-preview-remove"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(product?.image || '');
                        setErrors(prev => ({ ...prev, image: '' }));
                        // Reset file input
                        const fileInput = document.getElementById('image');
                        if (fileInput) fileInput.value = '';
                      }}
                      disabled={isLoading}
                    >
                      <i className="fas fa-times"></i>
                      Remove New Image
                    </button>
                  )}
                </div>
                <img 
                  src={imagePreview} 
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
