import React from 'react';
import { Link } from 'react-router-dom';
import classes from './thumbnails.module.css'; // Ensure to import your styles
import Price from '../Price/Price';
import StarRating from '../StarRating/StarRating';

export default function Thumbnails({ cups = [] }) { // Set default to an empty array
    return (
        <ul className={classes.list}>
            {cups.map(cup => (
                <li key={cup.id}>
                    <Link to={`/cup/${cup.id}`}>
                        <img
                            className={classes.image}
                            src={`/cups/${cup.imageUrl}`} // Use backticks for template literals
                            alt={cup.name}
                        />
                    </Link>
                    <div className={classes.content}>
                        <div className={classes.name}>{cup.name}</div>
                        <span
                            className={`${classes.favorite} ${cup.favorite ? '' : classes.not}`}
                        >
                            ♥
                        </span>
                        <div className={classes.stars}>
                            <StarRating stars={cup.stars} /> {/* Ensure stars is passed correctly */}
                        </div>
                    </div>
                    <div className={classes.price}>
                        <Price price={cup.price} />
                    </div>
                </li>
            ))}
        </ul>
    );
}
