import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import session from './session'
import products from './products'
import shoppingCart from './shoppingCart'

// Orders reducer inline since we're having file creation issues
const LOAD_ORDERS = 'orders/LOAD_ORDERS';
const ADD_ORDER = 'orders/ADD_ORDER';
const CLEAR_ORDERS = 'orders/CLEAR_ORDERS';

const loadOrders = (orders) => ({ type: LOAD_ORDERS, orders });
const addOrder = (order) => ({ type: ADD_ORDER, order });
const clearOrders = () => ({ type: CLEAR_ORDERS });

export const fetchUserOrders = () => async (dispatch) => {
    try {
        const response = await fetch('/api/orders');
        if (response.ok) {
            const data = await response.json();
            dispatch(loadOrders(data.orders));
            return data.orders;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.errors?.[0] || 'Failed to fetch orders');
        }
    } catch (error) {
        console.error('Error fetching orders:', error);
        throw error;
    }
};

export const createOrder = (cartItems) => async (dispatch) => {
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart_items: cartItems })
        });
        if (response.ok) {
            const data = await response.json();
            dispatch(addOrder(data.order));
            return data.order;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.errors?.[0] || 'Failed to create order');
        }
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

const ordersReducer = (state = { orders: {} }, action) => {
    switch (action.type) {
        case LOAD_ORDERS:
            const ordersObj = {};
            if (action.orders) {
                action.orders.forEach(order => { ordersObj[order.id] = order; });
            }
            return { ...state, orders: ordersObj };
        case ADD_ORDER:
            return { ...state, orders: { ...state.orders, [action.order.id]: action.order } };
        case CLEAR_ORDERS:
            return { ...state, orders: {} };
        default:
            return state;
    }
};

const rootReducer = combineReducers({
  session,
  products,
  shoppingCart,
  orders: ordersReducer,
});


let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
