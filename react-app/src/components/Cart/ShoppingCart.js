import { useSelector } from "react-redux"
import { useResetCartItems } from "../../store/shoppingCart"
import CartItem from "./CartItem"
import "./Cart.css"
import { useEffect, useState } from "react"

const ShoppingCart = () => {
   const [total, setTotal] = useState(0)
   const [isProcessing, setIsProcessing] = useState(false)

   const cartObject = useSelector(state => state.shoppingCart)
   const itemList = Object.values(cartObject)
   const resetCart = useResetCartItems()

   useEffect(() => {
      let total = 0
      itemList.forEach((item) => {
         total += item.price
      })

      setTotal(total.toFixed(2))
   }, [itemList])

   const handlePurchase = async () => {
      setIsProcessing(true)
      
      // Simulate processing time
      setTimeout(() => {
         resetCart()
         setIsProcessing(false)
      }, 1500)
   }

   const itemCount = itemList.reduce((count, item) => count + item.quantity, 0)

   // Empty cart state
   if (itemList.length === 0) {
      return (
         <div className="cart-container">
            <div className="cart-empty">
               <div className="cart-empty-icon">
                  <i className="fas fa-shopping-cart"></i>
               </div>
               <h3 className="cart-empty-title">Your cart is empty</h3>
               <p className="cart-empty-subtitle">
                  Add some fresh produce to get started!
               </p>
               <div className="cart-empty-features">
                  <div className="cart-feature">
                     <i className="fas fa-leaf"></i>
                     <span>Fresh & Local</span>
                  </div>
                  <div className="cart-feature">
                     <i className="fas fa-truck"></i>
                     <span>Fast Delivery</span>
                  </div>
                  <div className="cart-feature">
                     <i className="fas fa-handshake"></i>
                     <span>Support Farmers</span>
                  </div>
               </div>
            </div>
         </div>
      )
   }

   return (
      <div className="cart-container">
         {/* Cart Header */}
         <div className="cart-summary">
            <div className="cart-summary-info">
               <span className="cart-item-count">
                  {itemCount} {itemCount === 1 ? 'item' : 'items'}
               </span>
               <span className="cart-total-amount">
                  ${total}
               </span>
            </div>
         </div>

         {/* Cart Items */}
         <div className="cart-items-container">
            {itemList.map((item) => (
               <CartItem key={item.productId} item={item} />
            ))}
         </div>

         {/* Cart Footer */}
         <div className="cart-footer">
            <div className="cart-total-section">
               <div className="cart-subtotal">
                  <span className="cart-subtotal-label">Subtotal:</span>
                  <span className="cart-subtotal-amount">${total}</span>
               </div>
               <div className="cart-shipping">
                  <span className="cart-shipping-label">Delivery:</span>
                  <span className="cart-shipping-amount">Free</span>
               </div>
               <div className="cart-total-final">
                  <span className="cart-total-label">Total:</span>
                  <span className="cart-total-amount">${total}</span>
               </div>
            </div>

            <div className="cart-actions">
               <button 
                  className="btn btn-primary btn-lg cart-checkout-btn"
                  onClick={handlePurchase}
                  disabled={isProcessing}
               >
                  {isProcessing ? (
                     <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Processing...
                     </>
                  ) : (
                     <>
                        <i className="fas fa-credit-card"></i>
                        Checkout Now
                     </>
                  )}
               </button>
               
               <p className="cart-checkout-note">
                  <i className="fas fa-shield-alt"></i>
                  Secure checkout with 256-bit SSL encryption
               </p>
            </div>
         </div>
      </div>
   )
}

export default ShoppingCart
