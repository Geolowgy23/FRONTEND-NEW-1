import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classes from './search.module.css';

// Import the local SVG icon
import searchIcon from '../../assets/search.svg';

export default function Search({
  searchRoute = '/search/',        // Default value set directly here
  defaultRoute = '/',            // Default value set directly here
  margin,                        // No default provided, as it might be undefined
  placeholder = 'Search Pzam Cups!', // Default value set directly here
}) {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();
  const { searchTerm } = useParams();

  // When searchTerm changes (from URL), update term
  useEffect(() => {
    setTerm(searchTerm ?? '');  
  }, [searchTerm]);

  // Perform the search action
  const search = async () => {
    term ? navigate(searchRoute + term) : navigate(defaultRoute);
  };

  return (
    <div className={classes.container} style={{ margin }}>
      {/* Input Field for Search Term */}
      <input
        type="text"
        placeholder={placeholder}
        onChange={e => setTerm(e.target.value)} // Update the term as user types
        onKeyUp={e => e.key === 'Enter' && search()} // Trigger search when Enter is pressed
        value={term} // Controlled input value
      />

      {/* Button with SVG Search Icon */}
      <button onClick={search} className={classes.searchButton}>
        {/* Using the locally imported SVG for the search icon */}
        <img
          src={searchIcon} 
          alt="Search"
          className={classes.searchIcon}
        />
      </button>
    </div>
  );
}
