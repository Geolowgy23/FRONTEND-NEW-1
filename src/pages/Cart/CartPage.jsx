import React from 'react';
import classes from './cartPage.module.css';
import { useCart } from '../../hooks/useCart';
import Title from '../../components/Title/Title';
import { Link, useNavigate } from 'react-router-dom';
import Price from '../../components/Price/Price';

export default function CartPage() {
    const { cart, removeFromCart, changeQuantity } = useCart();
    const navigate = useNavigate();
    const isLoggedIn = localStorage.getItem('token'); // Check if user is logged in

    const handleProceedToCheckout = () => {
        if (!isLoggedIn) {
            alert('You need to be logged in to proceed to checkout.');
            navigate('/login'); // Redirect to the login page
        } else {
            navigate('/checkout'); // Proceed to checkout if logged in
        }
    };

    return (
        <>
            <Title title="Cart Page" margin="1.5rem 0 0 2.5rem" />

            {cart && cart.items.length > 0 && (
                <div className={classes.container}>
                    <ul className={classes.list}>
                        {cart.items.map(item => (
                            <li key={item.cup.id}>
                                <div>
                                    <img
                                        src={`/cups/${item.cup.imageUrl}`} // Use backticks for template literals
                                        alt={item.cup.name}
                                    />
                                </div>
                                <div>
                                    <Link to={`/cup/${item.cup.id}`}>{item.cup.name}</Link>
                                </div>

                                <div>
                                    <select
                                        value={item.quantity} 
                                        onChange={e => changeQuantity(item, Number(e.target.value))}
                                    >
                                        <option>200</option>
                                        <option>500</option>
                                        <option>1000</option>
                                        <option>1500</option>
                                        <option>2000</option>
                                        <option>2500</option>
                                        <option>3000</option>
                                        <option>3500</option>
                                        <option>4000</option>
                                        <option>5000</option>
                                    </select>
                                </div>
                                <div>
                                    <Price price={item.price} />
                                </div>

                                <div>
                                    <button className={classes.remove_button} onClick={() => removeFromCart(item.cup.id)}>Remove</button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className={classes.checkout}>
                        <div>
                            <div className={classes.cups_count}>{cart.totalCount}</div>
                            <div className={classes.total_price}>
                                <Price price={cart.totalPrice} />
                            </div>
                        </div>
                        <button onClick={handleProceedToCheckout}>
                            Proceed To Checkout
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
