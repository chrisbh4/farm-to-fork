import React from 'react';
import './PurchaseCompleteModal.css';

const PurchaseCompleteModal = ({ isOpen, onClose, order }) => {
    if (!isOpen) return null;

    const formatPrice = (price) => {
        return `$${parseFloat(price).toFixed(2)}`;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const totalItems = order?.order_details?.reduce((sum, detail) => sum + detail.quantity, 0) || 0;

    return (
        <div className="purchase-modal-overlay" onClick={onClose}>
            <div className="purchase-modal" onClick={(e) => e.stopPropagation()}>
                {/* Success Header */}
                <div className="purchase-modal-header">
                    <div className="purchase-success-icon">
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <h2 className="purchase-modal-title">Purchase Complete!</h2>
                    <p className="purchase-modal-subtitle">
                        Thank you for your order. Your fresh produce is on its way!
                    </p>
                </div>

                {/* Order Summary */}
                <div className="purchase-modal-content">
                    <div className="purchase-order-info">
                        <div className="purchase-order-header">
                            <h3>Order Summary</h3>
                            <div className="purchase-order-details">
                                <div className="purchase-order-detail">
                                    <span className="purchase-label">Order #:</span>
                                    <span className="purchase-value">{order?.id}</span>
                                </div>
                                <div className="purchase-order-detail">
                                    <span className="purchase-label">Date:</span>
                                    <span className="purchase-value">{formatDate(order?.created_at)}</span>
                                </div>
                                <div className="purchase-order-detail">
                                    <span className="purchase-label">Items:</span>
                                    <span className="purchase-value">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        {order?.order_details && (
                            <div className="purchase-items-list">
                                {order.order_details.map((detail, index) => (
                                    <div key={index} className="purchase-item">
                                        <div className="purchase-item-info">
                                            <span className="purchase-item-name">{detail.product_name}</span>
                                            <span className="purchase-item-quantity">Qty: {detail.quantity}</span>
                                        </div>
                                        <div className="purchase-item-price">
                                            {formatPrice(detail.total_price)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Total */}
                        <div className="purchase-total-section">
                            <div className="purchase-total-line">
                                <span>Subtotal:</span>
                                <span>{formatPrice(order?.total_price)}</span>
                            </div>
                            <div className="purchase-total-line">
                                <span>Delivery:</span>
                                <span>Free</span>
                            </div>
                            <div className="purchase-total-line purchase-total-final">
                                <span>Total:</span>
                                <span>{formatPrice(order?.total_price)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Next Steps */}
                    <div className="purchase-next-steps">
                        <h4>What's Next?</h4>
                        <div className="purchase-steps">
                            <div className="purchase-step">
                                <div className="purchase-step-icon">
                                    <i className="fas fa-box"></i>
                                </div>
                                <div className="purchase-step-content">
                                    <h5>Farmers Prepare Your Order</h5>
                                    <p>Local farmers will carefully prepare your fresh produce</p>
                                </div>
                            </div>
                            <div className="purchase-step">
                                <div className="purchase-step-icon">
                                    <i className="fas fa-truck"></i>
                                </div>
                                <div className="purchase-step-content">
                                    <h5>Free Delivery</h5>
                                    <p>Your order will be delivered fresh to your door</p>
                                </div>
                            </div>
                            <div className="purchase-step">
                                <div className="purchase-step-icon">
                                    <i className="fas fa-heart"></i>
                                </div>
                                <div className="purchase-step-content">
                                    <h5>Enjoy Fresh Produce</h5>
                                    <p>Support local farmers while enjoying the freshest ingredients</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal Actions */}
                <div className="purchase-modal-actions">
                    <button 
                        className="btn btn-secondary purchase-view-orders-btn"
                        onClick={() => {
                            onClose();
                            window.location.href = '/orders';
                        }}
                    >
                        <i className="fas fa-history"></i>
                        View My Orders
                    </button>
                    <button 
                        className="btn btn-primary purchase-continue-btn"
                        onClick={onClose}
                    >
                        <i className="fas fa-shopping-cart"></i>
                        Continue Shopping
                    </button>
                </div>

                {/* Close Button */}
                <button 
                    className="purchase-modal-close"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <i className="fas fa-times"></i>
                </button>
            </div>
        </div>
    );
};

export default PurchaseCompleteModal; 