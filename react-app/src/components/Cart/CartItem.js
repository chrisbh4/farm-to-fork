import { useSelector } from "react-redux"
import { useRemoveItem, useAddItem, useSubtractItem } from "../../store/shoppingCart"
import "./Cart.css"

const CartItem = ({ item }) => {
    const product = useSelector(state => state.products[item.productId])
    const cart = useSelector(state => state.shoppingCart)
    const addItem = useAddItem(product, cart)
    const removeItem = useRemoveItem(product.id, cart)
    const subtractItem = useSubtractItem(product, cart)

    // Safety checks for missing data
    if (!product || !item) {
        return null; // Product or item not found
    }

    // Add null checks and fallbacks for price values
    const unitPrice = product.price || 0;
    const totalPrice = item.price || 0;
    const quantity = item.quantity || 0;

    return (
        <div className="cart-item">
            {/* Product Image */}
            <div className="cart-item-image-container">
                <img 
                    src={product.image || 'https://i.imgur.com/BPOYKBx.png'} 
                    alt={product.name} 
                    className="cart-item-image"
                />
            </div>

            {/* Product Info */}
            <div className="cart-item-info">
                <h4 className="cart-item-name">{product.name}</h4>
                <p className="cart-item-description">
                    Fresh, organic produce from local farmers
                </p>
                <div className="cart-item-price-info">
                    <span className="cart-item-unit-price">
                        ${unitPrice.toFixed(2)} per lb
                    </span>
                </div>
            </div>

            {/* Quantity Controls */}
            <div className="cart-item-quantity-section">
                <label className="cart-quantity-label">Quantity:</label>
                <div className="cart-item-quantity-controls">
                    <button 
                        className="quantity-btn quantity-btn-decrease"
                        onClick={subtractItem}
                        disabled={quantity <= 1}
                        title="Decrease quantity"
                    >
                        <i className="fas fa-minus"></i>
                    </button>
                    
                    <span className="cart-item-quantity">{quantity}</span>
                    
                    <button 
                        className="quantity-btn quantity-btn-increase"
                        onClick={addItem}
                        title="Increase quantity"
                    >
                        <i className="fas fa-plus"></i>
                    </button>
                </div>
            </div>

            {/* Price & Actions */}
            <div className="cart-item-actions">
                <div className="cart-item-total-price">
                    ${totalPrice.toFixed(2)}
                </div>
                
                <button 
                    className="cart-item-remove-btn"
                    onClick={removeItem}
                    title="Remove from cart"
                >
                    <i className="fas fa-trash"></i>
                    Remove
                </button>
            </div>
        </div>
    )
}

export default CartItem
