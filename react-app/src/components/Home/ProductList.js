import { useState } from "react";
import ProductPage from "../Products/ProductPage"
import { useSelector } from "react-redux";
import { useAddItem } from "../../store/shoppingCart";

function ProductList({product, user}) {
    const [showProductModal, setShowProductModal] = useState(false)

    const cart = useSelector(state => state.shoppingCart)
    const addItem = useAddItem(product, cart)

    return (
        <div className='product-container' key={product.id}>
            <div className="product-card card">
                {/* Product Image */}
                <div className="product-image-container">
                    <img 
                        src={product.image || 'https://i.imgur.com/BPOYKBx.png'} 
                        alt={product.name}
                        className="product-image"
                        onClick={() => setShowProductModal(true)}
                    />
                    
                    {/* Quick Add Button */}
                    {user && (
                        <button 
                            className='product-quick-add'
                            onClick={addItem}
                            title="Add to cart"
                        >
                            <i className="fas fa-plus"></i>
                        </button>
                    )}

                    {/* Product Badge */}
                    <div className="product-badge">
                        <i className="fas fa-leaf"></i>
                        <span>Fresh</span>
                    </div>
                </div>

                {/* Product Info */}
                <div className="card-body">
                    <div className="product-info">
                        <h3 
                            className="product-name"
                            onClick={() => setShowProductModal(true)}
                        >
                            {product.name}
                        </h3>
                        
                        <div className="product-meta">
                            <span className="product-category">
                                <i className="fas fa-tag"></i>
                                Organic Produce
                            </span>
                        </div>

                        <div className="product-price-section">
                            <span className="product-price">
                                ${product.price.toFixed(2)}
                            </span>
                            <span className="product-unit">per lb</span>
                        </div>
                    </div>

                    {/* Product Actions */}
                    <div className="product-actions">
                        <button 
                            className="btn btn-outline btn-sm product-view-btn"
                            onClick={() => setShowProductModal(true)}
                        >
                            <i className="fas fa-eye"></i>
                            View Details
                        </button>
                        
                        {user && (
                            <button 
                                className="btn btn-primary btn-sm product-add-btn"
                                onClick={addItem}
                            >
                                <i className="fas fa-shopping-cart"></i>
                                Add to Cart
                            </button>
                        )}
                    </div>
                </div>

                {/* Farmer Info */}
                <div className="product-farmer-info">
                    <div className="farmer-avatar">
                        <i className="fas fa-user-circle"></i>
                    </div>
                    <div className="farmer-details">
                        <span className="farmer-label">Grown by</span>
                        <span className="farmer-name">{product.username || 'Local Farmer'}</span>
                    </div>
                    <div className="farmer-rating">
                        <i className="fas fa-star"></i>
                        <span>4.9</span>
                    </div>
                </div>
            </div>

            {/* Product Modal */}
            {showProductModal && (
                <ProductPage 
                    product={product} 
                    setShowProductModal={setShowProductModal} 
                />
            )}
        </div>
    )
}

export default ProductList;
