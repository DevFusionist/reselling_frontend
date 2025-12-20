'use client';

import { FaStar } from 'react-icons/fa';
import ReviewRating from './ReviewRating';

interface ReviewStatsProps {
  stats: {
    average_rating: number;
    total_reviews: number;
    rating_1: number;
    rating_2: number;
    rating_3: number;
    rating_4: number;
    rating_5: number;
  };
}

export default function ReviewStats({ stats }: ReviewStatsProps) {
  const { average_rating, total_reviews, rating_1, rating_2, rating_3, rating_4, rating_5 } = stats;

  const getPercentage = (count: number) => {
    if (total_reviews === 0) return 0;
    return (count / total_reviews) * 100;
  };

  const ratingDistribution = [
    { rating: 5, count: rating_5 },
    { rating: 4, count: rating_4 },
    { rating: 3, count: rating_3 },
    { rating: 2, count: rating_2 },
    { rating: 1, count: rating_1 },
  ];

  return (
    <div className="bg-card-taupe p-6 rounded-lg border border-divider-silver">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Overall Rating */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-5xl font-bold text-text-cream mb-2">
            {average_rating.toFixed(1)}
          </div>
          <ReviewRating rating={average_rating} size="lg" showValue={false} />
          <p className="text-text-lavender text-sm mt-2">
            Based on {total_reviews} {total_reviews === 1 ? 'review' : 'reviews'}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          {ratingDistribution.map(({ rating, count }) => (
            <div key={rating} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-20">
                <span className="text-text-cream text-sm font-medium">{rating}</span>
                <FaStar className="text-cta-copper text-xs" />
              </div>
              <div className="flex-1 bg-divider-silver/30 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-cta-copper h-full transition-all duration-300"
                  style={{ width: `${getPercentage(count)}%` }}
                />
              </div>
              <span className="text-text-lavender text-sm w-12 text-right">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

