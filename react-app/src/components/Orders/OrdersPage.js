import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserOrders } from '../../store';
import OrderCard from './OrderCard';
import './Orders.css';

const OrdersPage = () => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const ordersState = useSelector(state => state.orders);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const orders = Object.values(ordersState.orders || {});

    useEffect(() => {
        if (user) {
            loadOrders();
        }
    }, [user]);

    const loadOrders = async () => {
        try {
            setIsLoading(true);
            setError('');
            await dispatch(fetchUserOrders());
        } catch (err) {
            setError(err.message || 'Failed to load orders');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="orders-page">
                <div className="orders-not-logged-in">
                    <div className="orders-empty-icon">
                        <i className="fas fa-user-lock"></i>
                    </div>
                    <h2>Please Log In</h2>
                    <p>You need to be logged in to view your orders.</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="orders-page">
                <div className="orders-loading">
                    <div className="loading-spinner">
                        <i className="fas fa-spinner fa-spin"></i>
                    </div>
                    <p>Loading your orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="orders-page">
                <div className="orders-error">
                    <div className="orders-error-icon">
                        <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <h2>Error Loading Orders</h2>
                    <p>{error}</p>
                    <button 
                        className="btn btn-primary"
                        onClick={loadOrders}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <div className="orders-header">
                <h1>My Orders</h1>
                <p className="orders-subtitle">
                    Track your fresh produce orders and order history
                </p>
            </div>

            {orders.length === 0 ? (
                <div className="orders-empty">
                    <div className="orders-empty-icon">
                        <i className="fas fa-shopping-bag"></i>
                    </div>
                    <h2>No Orders Yet</h2>
                    <p>You haven't placed any orders yet. Start shopping for fresh produce!</p>
                    <a href="/products" className="btn btn-primary">
                        <i className="fas fa-shopping-cart"></i>
                        Start Shopping
                    </a>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersPage; 