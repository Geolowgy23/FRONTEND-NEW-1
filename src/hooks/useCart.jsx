import React, { createContext, useContext, useEffect, useState } from 'react';
import { sample_cups } from '../data';

const CartContext = createContext(null);
const CART_KEY = 'cart';
const EMPTY_CART = {
    items: [],
    totalPrice: 0,
    totalCount: 0, // Count of unique products
};

// Function to get cart from local storage
function getCartFromLocalStorage() {
    const storedCart = localStorage.getItem(CART_KEY);
    return storedCart ? JSON.parse(storedCart) : EMPTY_CART;
}

export default function CartProvider({ children }) {
    const initCart = getCartFromLocalStorage();

    const [cartItems, setCartItems] = useState(initCart.items);
    const [totalPrice, setTotalPrice] = useState(initCart.totalPrice);
    const [totalCount, setTotalCount] = useState(initCart.totalCount || 0); // Initialize to 0 if undefined

    useEffect(() => {
        const totalPrice = sum(cartItems.map(item => item.price));
        const totalCount = cartItems.length; // Count unique products
        setTotalPrice(totalPrice);
        setTotalCount(totalCount);

        // Store the updated cart in localStorage
        localStorage.setItem(CART_KEY, JSON.stringify({
            items: cartItems,
            totalPrice,
            totalCount,
        }));
    }, [cartItems]);

    const sum = items => {
        return items.reduce((prevValue, curValue) => prevValue + curValue, 0);
    }

    const removeFromCart = cupId => {
        const filteredCartItems = cartItems.filter(item => item.cup.id !== cupId);
        setCartItems(filteredCartItems);
    };

    const changeQuantity = (cartItem, newQuantity) => {
        const { cup } = cartItem;

        const changedCartItem = {
            ...cartItem,
            quantity: newQuantity,
            price: cup.price * newQuantity, // Recalculate price based on quantity
        };
        setCartItems(
            cartItems.map(item => item.cup.id === cup.id ? changedCartItem : item)
        );
    }

    const addToCart = cup => {
        const cartItem = cartItems.find(item => item.cup.id === cup.id);
        if (cartItem) {
            changeQuantity(cartItem, cartItem.quantity + 1);
        } else {
            setCartItems([...cartItems, { cup, quantity: 1, price: cup.price }]);
        }
    };

    return (
        <CartContext.Provider value={{
            cart: { items: cartItems, totalPrice, totalCount },
            removeFromCart,
            changeQuantity,
            addToCart,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
