import React, { useState } from 'react'; // Import useState to manage error state
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate

function Payment() {
    const location = useLocation();
    const navigate = useNavigate(); // Hook to navigate to different routes
    const { totalPrice } = location.state || { totalPrice: 0 };
    const [error, setError] = useState(''); // State to manage error messages

    const handlePayment = async () => {
        try {
            const amountInCentavos = Math.round(totalPrice * 100); // Convert to centavos
            const response = await axios.post('http://localhost:5000/api/payment-link', {
                data: {
                    attributes: {
                        amount: amountInCentavos,
                        description: "Payment for Order",
                        remarks: "none"
                    }
                }
            });

            console.log('Payment link created:', response.data);
            if (response.data && response.data.data && response.data.data.attributes) {
                // Redirect to the payment link
                window.open(response.data.data.attributes.checkout_url, '_blank');

                // Once payment is initiated, navigate to the homepage
                // Assuming that payment completion will be handled by PayMongo on their page
                // If you need to check payment status, this could be handled with webhook or another callback
                setTimeout(() => {
                    // Navigate back to the homepage after 3 seconds (you can adjust the time)
                    navigate('/'); // Redirect to the homepage after payment initiation
                }, 3000); // Adjust delay if necessary

            }
        } catch (error) {
            if (error.response) {
                console.error('Payment error:', error.response.data);
                setError(`Payment error: ${error.response.data.message || 'An error occurred'}`);
            } else {
                console.error('Payment error:', error);
                setError('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
            <div className="w-[90%] md:w-[40%] h-auto bg-white flex flex-col items-center border rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-center mb-4">Pay with GCash</h1>
                <p className="text-gray-600 mb-6 text-center">
                    Complete your payment of <span className="font-semibold">PHP {totalPrice}</span> via GCash.
                </p>

                {/* GCash logo or relevant image */}
                <img
                    src="gcash.jpg" // Ensure this image path is correct
                    alt="GCash Logo"
                    className="w-1/2 mb-6"
                />

                {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error if exists */}

                <button
                    onClick={handlePayment}
                    className="bg-blue-500 text-white text-lg font-semibold rounded w-full h-12 hover:bg-blue-600 transition duration-200"
                >
                    Proceed to GCash Payment
                </button>

                <p className="text-sm text-gray-500 mt-4">
                    By clicking "Proceed to GCash Payment," you agree to our terms and conditions.
                </p>
            </div>
        </div>
    );
}

export default Payment;
