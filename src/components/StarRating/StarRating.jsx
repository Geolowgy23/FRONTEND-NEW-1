import React, { useState } from 'react';
import classes from './starRating.module.css';

// Importing the SVGs
import starFull from '../../assets/star-full.svg';
import starHalf from '../../assets/star-half.svg';
import starEmpty from '../../assets/star-empty.svg';

export default function StarRating({ stars, size = 18, onRatingChange }) {
    const [selectedRating, setSelectedRating] = useState(stars); // State to track selected rating

    const styles = {
        width: size + 'px',
        height: size + 'px',
        marginRight: size / 6 + 'px', // Adjust spacing between stars
    };

    // Component to handle individual stars
    function Star({ number }) {
        const halfNumber = number - 0.5;

        // Logic to determine which star to show
        let starImage;
        if (selectedRating >= number) {
            starImage = starFull; // Full star
        } else if (selectedRating >= halfNumber) {
            starImage = starHalf; // Half star
        } else {
            starImage = starEmpty; // Empty star
        }

        const handleClick = () => {
            setSelectedRating(number); // Set the selected rating on click
            if (onRatingChange) {
                onRatingChange(number); // Pass the selected rating to the parent component
            }
        };

        return (
            <img
                src={starImage}
                style={styles}
                alt={`star-${number}`}
                onClick={handleClick} // Handle click on the star
            />
        );
    }

    return (
        <div className={classes.rating}>
            {[1, 2, 3, 4, 5].map(number => (
                <Star key={number} number={number} />
            ))}
        </div>
    );
}
