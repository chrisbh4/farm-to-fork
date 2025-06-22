import React, { useState } from 'react';
import './Orders.css';

const OrderCard = ({ order }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatPrice = (price) => {
        return `$${parseFloat(price).toFixed(2)}`;
    };

    const orderDate = formatDate(order.created_at);
    const totalItems = order.order_details?.reduce((sum, detail) => sum + detail.quantity, 0) || 0;

    return (
        <div className="order-card">
            <div className="order-card-header" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="order-info">
                    <div className="order-id">
                        <span className="order-label">Order #</span>
                        <span className="order-number">{order.id}</span>
                    </div>
                    <div className="order-date">
                        <i className="fas fa-calendar-alt"></i>
                        <span>{orderDate}</span>
                    </div>
                </div>
                
                <div className="order-summary">
                    <div className="order-items-count">
                        <i className="fas fa-shopping-bag"></i>
                        <span>{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
                    </div>
                    <div className="order-total">
                        <span className="order-total-amount">{formatPrice(order.total_price)}</span>
                    </div>
                </div>

                <div className="order-expand-icon">
                    <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                </div>
            </div>

            {isExpanded && (
                <div className="order-details">
                    <div className="order-details-header">
                        <h4>Order Details</h4>
                    </div>
                    
                    <div className="order-items">
                        {order.order_details?.map((detail) => (
                            <div key={detail.id} className="order-item">
                                <div className="order-item-image">
                                    {detail.product_image ? (
                                        <img 
                                            src={detail.product_image} 
                                            alt={detail.product_name}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/path/to/placeholder-image.jpg';
                                            }}
                                        />
                                    ) : (
                                        <div className="order-item-placeholder">
                                            <i className="fas fa-image"></i>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="order-item-info">
                                    <h5 className="order-item-name">{detail.product_name}</h5>
                                    <p className="order-item-price">
                                        {formatPrice(detail.product_price)} each
                                    </p>
                                </div>
                                
                                <div className="order-item-quantity">
                                    <span className="quantity-label">Qty:</span>
                                    <span className="quantity-value">{detail.quantity}</span>
                                </div>
                                
                                <div className="order-item-total">
                                    {formatPrice(detail.total_price)}
                                </div>
                            </div>
                        )) || (
                            <div className="order-items-empty">
                                <p>No items found for this order</p>
                            </div>
                        )}
                    </div>

                    <div className="order-details-footer">
                        <div className="order-summary-line">
                            <span>Subtotal:</span>
                            <span>{formatPrice(order.total_price)}</span>
                        </div>
                        <div className="order-summary-line">
                            <span>Delivery:</span>
                            <span>Free</span>
                        </div>
                        <div className="order-summary-line order-total-line">
                            <span>Total:</span>
                            <span>{formatPrice(order.total_price)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderCard; 