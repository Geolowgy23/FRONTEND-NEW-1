import React from 'react';
import { Link } from 'react-router-dom';
import classes from './tags.module.css';

export default function Tags({ tags, forCupPage }) {
  return (
    <div
      className={classes.container}
      style={{
        justifyContent: forCupPage ? 'start' : 'center',
      }}
    >
      {tags.map((tag) => (
        <Link key={tag.name} to={`/tag/${tag.name}`}>
          {tag.name}
          {!forCupPage &&  `(${tag.count})`}
        </Link>
      ))}
    </div>
  );
}
