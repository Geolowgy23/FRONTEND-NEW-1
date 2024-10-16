    import React from 'react';
    import { Link } from 'react-router-dom';
    import Price from '../Price/Price';
    import classes from './orderItemList.module.css';

    export default function OrderItemList({ items }) {
        return (
            <ul className={classes.list}>
                {items.map(item => (
                    <li key={item.cup.id} className={classes.item}>
                        <img src={`/cups/${item.cup.imageUrl}`} alt={item.cup.name} />
                        <div>
                            <Link to={`/cup/${item.cup.id}`}>{item.cup.name}</Link>
                            <Price price={item.price} />
                        </div>
                        <div>Quantity: {item.quantity}</div>
                    </li>
                ))}
            </ul>
        );
    }
