import React, { useEffect, useState } from 'react';
import classes from './cupPage.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { getById } from '../../Services/cupServices';
import StarRating from '../../components/StarRating/StarRating';
import Tags from '../../components/Tags/Tags';
import Price from '../../components/Price/Price';
import { useCart } from '../../hooks/useCart';

export default function CupPage() {
    const [cup, setCup] = useState(null); // Initialize as null to handle loading state
    const [printOption, setPrintOption] = useState('without'); // Default print option
    const { id } = useParams();
    const { addToCart } = useCart();
    const navigate = useNavigate();

    // Function to handle adding the cup to the cart
    const handleAddToCart = () => {
        if (cup) {
            // Calculate the final price based on the selected print option
            let finalPrice = cup.price;
            if (printOption === 'with') {
                finalPrice += 5; // Add ₱5 if 'with print' option is selected
            }

            console.log("Cup Price:", cup.price); // Debugging: Check cup price
            console.log("Final Price (with/without print):", finalPrice); // Debugging: Check final price

            let adjustedCup = { ...cup, price: finalPrice }; // Adjust price
            addToCart(adjustedCup); // Add to cart with adjusted price
            navigate('/cart'); // Navigate to cart page
        }
    };

    // Fetch the cup data when the component mounts
    useEffect(() => {
        getById(id).then(setCup); // Fetch cup by ID from the service
    }, [id]);

    // If cup data is not yet available, show a loading message
    if (!cup) {
        return <div>Loading...</div>;
    }

    return (
        <div className={classes.container}>
            {/* Cup Image */}
            <img
                className={classes.image}
                src={`/cups/${cup.imageUrl}`} // Dynamic image path
                alt={cup.name}
            />

            <div className={classes.details}>
                {/* Cup Name and Favorite Icon */}
                <div className={classes.header}>
                    <span className={classes.name}>{cup.name}</span>
                    <span className={`${classes.favorite} ${cup.favorite ? '' : classes.not}`}>
                        ♥
                    </span>
                </div>

                {/* Star Rating */}
                <div className={classes.rating}>
                    <StarRating stars={cup.stars} size={25} />
                </div>

                {/* Tags */}
                <div className={classes.tags}>
                    {cup.tags && (
                        <Tags tags={cup.tags.map(tag => ({ name: tag }))} forCupPage={true} />
                    )}
                </div>
            </div>

            {/* Price Display */}
            <div className={classes.price}>
                <Price price={printOption === 'with' ? cup.price + 5 : cup.price} /> {/* Display adjusted price */}
            </div>

            {/* Print Option Selection */}
            <div className={classes.printOptionContainer}>
                <label 
                    className={`${classes.printOption} ${printOption === 'without' ? classes.selected : ''}`} 
                    onClick={() => setPrintOption('without')}
                >
                    <input 
                        type="radio" 
                        value="without" 
                        checked={printOption === 'without'} 
                        onChange={() => setPrintOption('without')}
                    />
                    Without Print
                </label>
                
                <label 
                    className={`${classes.printOption} ${printOption === 'with' ? classes.selected : ''}`} 
                    onClick={() => setPrintOption('with')}
                >
                    <input 
                        type="radio" 
                        value="with" 
                        checked={printOption === 'with'} 
                        onChange={() => setPrintOption('with')}
                    />
                    With Print (+₱5.00) {/* Updated label to ₱5.00 */}
                </label>
            </div>

            {/* Add to Cart Button */}
            <button onClick={handleAddToCart}>Add To Cart</button>
        </div>
    );
}
