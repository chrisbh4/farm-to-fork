import React, { useState, useEffect, useRef } from 'react';
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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [productType, setProductType] = useState('Vegetables');
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector(state => state.session.user);
  const user_id = user.id;
  const history = useHistory();
  const dispatch = useDispatch();
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
        setImagePreview('');
      }
  };

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
      formData.append('user_id', user_id);
      formData.append('name', name.trim());
      formData.append('description', description.trim());
      formData.append('price', parseFloat(price));
      formData.append('quantity', quantity);
      formData.append('product_type', productType);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const data = await dispatch(fetchCreateProduct(formData));

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

          {/* Image Upload */}
          <div className="form-group">
            <label htmlFor="image" className="form-label">
              Product Image
            </label>
            <div className="form-input-container">
              <i className="fas fa-image form-input-icon"></i>
              <input
                id="image"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                className={`form-input ${errors.image ? 'form-input-error' : ''}`}
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </div>
            {errors.image && (
              <p className="form-error">
                <i className="fas fa-exclamation-circle"></i>
                {errors.image}
              </p>
            )}
            <p className="form-help-text">
              Optional: Upload an image to showcase your product (JPEG, PNG, GIF, or WebP, max 5MB)
            </p>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="image-preview">
                <p className="image-preview-label">Preview:</p>
                <img 
                  src={imagePreview} 
                  alt="Product preview" 
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    display: 'block'
                  }}
                  onError={() => {
                    setErrors(prev => ({ ...prev, image: 'Failed to display image preview' }));
                  }}
                />
                <button
                  type="button"
                  className="image-remove-btn"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                    setErrors(prev => ({ ...prev, image: '' }));
                    document.getElementById('image').value = '';
                  }}
                  disabled={isLoading}
                >
                  <i className="fas fa-times"></i>
                  Remove Image
                </button>
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
