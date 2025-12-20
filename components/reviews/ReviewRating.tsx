'use client';

import { FaStar } from 'react-icons/fa';

interface ReviewRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export default function ReviewRating({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  interactive = false,
  onRatingChange,
  className = '',
}: ReviewRatingProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      // Optional: Add hover effect
    }
  };

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.round(rating);
          const isHalfFilled = starValue - 0.5 <= rating && rating < starValue;

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => handleMouseEnter(starValue)}
              disabled={!interactive}
              className={`
                ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
                ${sizeClasses[size]}
                ${isFilled ? 'text-cta-copper' : 'text-divider-silver'}
              `}
              aria-label={`${starValue} star${starValue !== 1 ? 's' : ''}`}
            >
              <FaStar className={isHalfFilled ? 'opacity-50' : ''} />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className="text-text-lavender text-sm ml-2">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

