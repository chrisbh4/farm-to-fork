import { useDispatch } from "react-redux"
const LOAD_CART = 'cart/LOAD_CART'
const ADD_TO_CART = 'cart/ADD_TO_CART'
const REMOVE_FROM_CART = 'cart/REMOVE_FROM_CART'
const SUBTRACT_FROM_CART = 'cart/SUBTRACT_FROM_CART'
const RESET_CART = 'cart/RESET_CART'


export const loadCart = (cart) => ({
    type: LOAD_CART,
    cart
})

// export const addToCart = (item) => ({
//     type: ADD_TO_CART,
//     item
// })

export const removeFromCart = (itemId) => ({
    type: REMOVE_FROM_CART,
    itemId
})

export const subtractFromCart = (item) => ({
    type: SUBTRACT_FROM_CART,
    item
})

export const resetCart = () => ({
    type: RESET_CART,
})

const saveCart = (cart) => {
    try {
        // Clean up cart data before saving
        const cleanCart = {};
        for (const [productId, item] of Object.entries(cart)) {
            if (item && typeof item === 'object' && item.productId && item.quantity && item.price) {
                cleanCart[productId] = {
                    productId: item.productId,
                    quantity: Number(item.quantity) || 1,
                    price: Number(item.price) || 0
                };
            }
        }
        const jsonCart = JSON.stringify(cleanCart)
        localStorage.setItem('cart', jsonCart)
    }
    catch (err) {
    // ignore
    }
}

const loadCartFromStorage = () => {
    try {
        const jsonCart = localStorage.getItem('cart')
        if (jsonCart) {
            const cart = JSON.parse(jsonCart)
            // Clean up loaded cart data
            const cleanCart = {};
            for (const [productId, item] of Object.entries(cart)) {
                if (item && typeof item === 'object' && item.productId && item.quantity && item.price) {
                    cleanCart[productId] = {
                        productId: item.productId,
                        quantity: Number(item.quantity) || 1,
                        price: Number(item.price) || 0
                    };
                }
            }
            return cleanCart
        }
    }
    catch (err) {
        // If there's an error loading cart, clear it
        localStorage.removeItem('cart')
    }
    return {}
}

export const useAddItem = (product, cart) => {
    const dispatch = useDispatch()
    return async function(quantity = 1) {
        if (product.id in cart) {
            cart[product.id].quantity += quantity
            cart[product.id].price = product.price * cart[product.id].quantity
        } else {
            cart[product.id] = { productId: product.id, quantity: quantity, price: product.price * quantity }
        }
        await dispatch(loadCart(cart));
        saveCart(cart)
        return
    }
}

export const useSubtractItem = (product, cart) => {
    const dispatch = useDispatch()
    return async function() {
        if (cart[product.id].quantity <= 1) {
            delete cart[product.id]
        } else {
            cart[product.id].quantity -= 1
            cart[product.id].price = product.price * cart[product.id].quantity
        }
        await dispatch(loadCart(cart));
        saveCart(cart)
        return
    }
}

export const useRemoveItem = (productId, cart) => {
    const dispatch = useDispatch()
    return async function() {
        await dispatch(removeFromCart(productId));
        delete cart[productId]
        saveCart(cart)
        return
    }
}

export const useResetCartItems = () => {
    const dispatch = useDispatch()
    return async function() {
        await dispatch(resetCart());
        localStorage.removeItem('cart')
        return
    }
}


let initialState = loadCartFromStorage()


export default function reducer(state = initialState, action) {
    let newState = { ...state }
    let itemId;
    let item;

    switch (action.type) {
        case LOAD_CART:
            return { ...state, ...action.cart };
        case ADD_TO_CART:
            item = action.item
            if (item.id in newState) {
                newState[item.id].quantity += 1
                newState[item.id].price = item.price * newState[item.id].quantity
            } else {
                newState[item.id] = { productId: item.id, quantity: 1, price: item.price }
            }
            return newState
        case SUBTRACT_FROM_CART:
            item = action.item
            if (newState[item.id].quantity <= 1) {
                delete newState[item.id]
            } else {
                newState[item.id].quantity -= 1
                newState[item.id].price = item.price * newState[item.id].quantity
            }
            return newState
        case REMOVE_FROM_CART:
            itemId = action.itemId
            delete newState[itemId]
            return newState
        case RESET_CART:
            return state = {}
        default:
            return state;
    }
}
