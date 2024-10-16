import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import classes from './loginPage.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false); // Track if admin login is active
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isAdminLogin) {
      // Handle Admin Login
      try {
        const { data } = await axios.post('http://localhost:5000/admin-login', {
          username: adminUsername,
          password: adminPassword,
        });
        localStorage.setItem('token', data.token); // Save JWT token
        localStorage.setItem('user', adminUsername); // Save username
        localStorage.setItem('isAdmin', 'true'); // Set admin status
        navigate('/admin-dashboard'); // Redirect to admin dashboard
      } catch (error) {
        if (error.response) {
          alert(`Admin login failed: ${error.response.data || 'Invalid credentials'}`);
        } else {
          alert('Admin login failed: Server error');
        }
      }
    } else {
      // Handle User Login
      try {
        const { data } = await axios.post('http://localhost:5000/login', {
          username,
          password,
        });
        localStorage.setItem('token', data.token); // Save JWT token
        localStorage.setItem('user', username); // Save username
        localStorage.setItem('isAdmin', 'false'); // Set admin status
        navigate('/'); // Redirect to homepage after login
      } catch (error) {
        if (error.response) {
          alert(`Login failed: ${error.response.data || 'Invalid credentials'}`);
        } else {
          alert('Login failed: Server error');
        }
      }
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.details}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          {!isAdminLogin ? ( // Show user login fields
            <>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </>
          ) : ( // Show admin login fields
            <>
              <input
                type="text"
                placeholder="Admin Username"
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Admin Password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />
            </>
          )}
          <button type="submit">{isAdminLogin ? 'Login as Admin' : 'Login'}</button>
        </form>
        <div className={classes.registerPrompt}>
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
        <div className={classes.adminLoginPrompt}>
          <h3>Login as Admin</h3>
          <button onClick={() => setIsAdminLogin(!isAdminLogin)}>
            {isAdminLogin ? 'Back to User Login' : 'Admin Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
