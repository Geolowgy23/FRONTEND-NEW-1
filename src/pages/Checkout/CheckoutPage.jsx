import React from 'react';
import { useCart } from '../../hooks/useCart';
import OrderItemList from '../../components/OrderItemList/OrderItemList';
import Price from '../../components/Price/Price';
import classes from './checkoutPage.module.css';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
    const { cart } = useCart(); // Hook to get cart items
    const navigate = useNavigate(); // Initialize useNavigate

    // Getting the token from local storage
    const token = localStorage.getItem('token');
    const currentUser = { id: 1 }; // Replace this with your logic to get the current user ID

    const handleConfirmOrder = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/orders/confirm-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Bearer token for authentication
                },
                body: JSON.stringify({
                    userId: currentUser.id,
                    items: cart.items,
                    totalPrice: cart.totalPrice,
                    totalItems: cart.totalCount
                })
            });

            // Check if the response is OK
            if (response.ok) {
                // Navigate to payment page after successful order confirmation
                navigate('/payment', { state: { totalPrice: cart.totalPrice } });
            } else {
                const errorData = await response.json(); // Get error message from response
                console.error('Order confirmation failed:', errorData.message);
            }
        } catch (error) {
            console.error('Error confirming order:', error);
        }
    };

    return (
        <div className={classes.container}>
            <h2>Checkout</h2>
            <OrderItemList items={cart.items} />
            <div className={classes.summary}>
                <h3>Order Summary</h3>
                <div>
                    <strong>Total Price:</strong> <Price price={cart.totalPrice} />
                </div>
                <div>
                    <strong>Total Items:</strong> {cart.totalCount}
                </div>
            </div>
            <button className={classes.confirmButton} onClick={handleConfirmOrder}>
                Confirm Order
            </button>
        </div>
    );
}
