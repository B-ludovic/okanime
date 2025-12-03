'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';
import styles from '../../styles/modules/StarRating.module.css';

export default function StarRating({ rating, onRatingChange, readonly = false, size = 24 }) {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className={styles.starRating}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
        <button
          key={value}
          type="button"
          className={`${styles.starButton} ${readonly ? styles.readonly : ''}`}
          onClick={() => handleClick(value)}
          onMouseEnter={() => handleMouseEnter(value)}
          onMouseLeave={handleMouseLeave}
          disabled={readonly}
        >
          <Star
            size={size}
            className={`${styles.starIcon} ${value <= displayRating ? styles.filled : ''}`}
            fill={value <= displayRating ? 'currentColor' : 'none'}
          />
        </button>
      ))}
      <span className={styles.ratingValue}>{rating}/10</span>
    </div>
  );
}