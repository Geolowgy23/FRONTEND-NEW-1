import React from 'react';

export default function Price({ price, locale = 'en-PH', currency = 'PHP' }) {
    const formatPrice = () => {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency, // Itakda ang currency sa PHP
            currencyDisplay: 'symbol' // Gamitin ang simbolo ng currency (₱)
        }).format(price);
    };

    return <span>{formatPrice()}</span>;
}
