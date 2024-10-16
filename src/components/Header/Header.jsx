import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import classes from './header.module.css';
import { useCart } from '../../hooks/useCart';
import cartLogo from '../../assets/cart.png'; // Import the cart logo PNG

export default function Header() {
  const [user, setUser] = useState(localStorage.getItem('user')); // Retrieve username from localStorage
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('isAdmin') === 'true'); // Check if user is admin
  const { cart } = useCart();

  useEffect(() => {
    // Update state when localStorage changes
    const handleStorageChange = () => {
      setUser(localStorage.getItem('user'));
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('token'); // Clear token
    localStorage.removeItem('user');  // Clear username
    localStorage.removeItem('isAdmin'); // Clear admin status
    setUser(null);
    setIsAdmin(false);
    window.location.reload(); // Reload the page to reflect logout
  };

  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <Link to="/" className={classes.logo}>PZAM Cups Printing Davao!</Link>
        <nav>
          <ul>
            {user ? (
              <li className={classes.menu_container}>
                <span>{user} {isAdmin && '(Admin)'}</span> {/* Show logged-in username with role */}
                <div className={classes.menu}>
                  <Link to="/profile">Profile</Link>
                  <a onClick={logout}>Logout</a>
                </div>
              </li>
            ) : (
              <Link to="/login">Login</Link>
            )}
            <li>
              <Link to="/cart" className={classes.cartLink}>
                <img src={cartLogo} alt="Cart" className={classes.cartIcon} />
                {cart.totalCount > 0 && (
                  <span className={classes.cartCount}>{cart.totalCount}</span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
