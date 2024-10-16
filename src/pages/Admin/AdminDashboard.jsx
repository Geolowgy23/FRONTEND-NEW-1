import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './AdminDashboard.css';

// Registering necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]); // State to store orders
    const [error, setError] = useState(''); // State to store errors
    const [loading, setLoading] = useState(true); // Loading state
    const [showOrders, setShowOrders] = useState(false); // State to toggle order visibility
    const [showChart, setShowChart] = useState(false); // State to toggle chart visibility

    // Fetch orders once the component is mounted
    useEffect(() => {
        const token = localStorage.getItem('token'); // Retrieve the token

        fetch('http://localhost:5000/admin/orders', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Send the token in headers
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch orders.');
            }
            return response.json();
        })
        .then((data) => {
            setOrders(data); // Set orders on successful fetch
        })
        .catch((err) => {
            setError(err.message); // Set error message if fetch fails
        })
        .finally(() => {
            setLoading(false); // Set loading to false once data is fetched
        });
    }, []);

    // Function to toggle the visibility of the orders table
    const toggleOrders = () => {
        setShowOrders(!showOrders); // Toggle the state
    };

    // Function to toggle the visibility of the chart
    const toggleChart = () => {
        setShowChart(!showChart); // Toggle the state for chart visibility
    };

    // Function to accept an order and update its status to 'Accepted'
    const acceptOrder = (orderId) => {
        const token = localStorage.getItem('token');
        axios
            .put(`http://localhost:5000/admin/orders/${orderId}`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            })
            .then((response) => {
                // Update the local state after accepting the order
                setOrders(orders.map((order) =>
                    order.id === orderId ? { ...order, status: 'Accepted' } : order
                ));
            })
            .catch((err) => {
                setError('Failed to update order status');
            });
    };

    // Data for the total sales chart
    const totalSalesChartData = {
        labels: orders.map(order => new Date(order.order_date).toLocaleDateString()),  // Order dates as labels
        datasets: [
            {
                label: 'Total Sales',  // Dataset name
                data: orders.map(order => order.total_price),  // Extract total price for each order as data
                fill: false,
                backgroundColor: 'rgba(75,192,192,1)',
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
            },
        ],
    };

    // Options for the total sales chart
    const totalSalesChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    // Prepare data for the order dates chart
    const orderDates = {};
    orders.forEach(order => {
        const date = new Date(order.order_date).toLocaleDateString();
        orderDates[date] = (orderDates[date] || 0) + 1; // Count orders for each date
    });

    // Data for the order dates chart
    const orderDatesChartData = {
        labels: Object.keys(orderDates), // Dates as labels
        datasets: [
            {
                label: 'Orders Count',  // Dataset name
                data: Object.values(orderDates),  // Count of orders for each date
                fill: false,
                backgroundColor: 'rgba(255,99,132,1)',
                borderColor: 'rgba(255,99,132,1)',
                tension: 0.1,
            },
        ],
    };

    // Options for the order dates chart
    const orderDatesChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                enabled: true,
            },
        },
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            <button
                onClick={toggleOrders}
                className="order-btn"
            >
                {showOrders ? 'Hide Orders' : 'Show Orders'} {/* Toggle button text */}
            </button>

            {/* Button for showing the chart */}
            <button
                onClick={toggleChart}
                className="chart-btn"
            >
                {showChart ? 'Hide Chart' : 'Show Chart'} {/* Toggle button text */}
            </button>

            {loading ? (
                <p>Loading orders...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : (
                showOrders && (
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>User ID</th>
                                <th>User Name</th>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Order Date</th>
                                <th>Total Price</th>
                                <th>Total Items</th>                                                
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.user_id}</td>
                                    <td>{order.username}</td>
                                    <td>{order.product_name}</td>
                                    <td>{order.quantity}</td>
                                    <td>{new Date(order.order_date).toLocaleString()}</td>
                                    <td>{order.total_price}</td>
                                    <td>{order.total_items}</td>                                  
                                    <td>                                     
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            )}

            {/* Chart display section */}
            {showChart && (
                <div className="chart-section">
                    <h3>Total Sales Over Time</h3>
                    <Line data={totalSalesChartData} options={totalSalesChartOptions} />

                    <h3>Orders Count Over Time</h3>
                    <Line data={orderDatesChartData} options={orderDatesChartOptions} /> {/* New order dates chart */}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
