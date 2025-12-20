'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReviewRating from './ReviewRating';
import { Review } from '@/lib/api';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { FaCheckCircle, FaThumbsUp, FaTrash } from 'react-icons/fa';

interface ReviewListProps {
  reviews: Review[];
  onReviewDeleted?: () => void;
  onReviewUpdated?: () => void;
}

export default function ReviewList({ reviews, onReviewDeleted }: ReviewListProps) {
  const { isLoggedIn, user } = useAuth();
  const [helpfulReviews, setHelpfulReviews] = useState<Set<number>>(new Set());
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleMarkHelpful = async (reviewId: number) => {
    if (helpfulReviews.has(reviewId)) return; // Already marked

    try {
      const response = await apiClient.markReviewHelpful(reviewId);
      if (response.success) {
        setHelpfulReviews(new Set([...helpfulReviews, reviewId]));
      }
    } catch (error) {
      console.error('Failed to mark review as helpful:', error);
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    setDeletingId(reviewId);
    try {
      const response = await apiClient.deleteReview(reviewId);
      if (response.success && onReviewDeleted) {
        onReviewDeleted();
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
      alert('Failed to delete review');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (reviews.length === 0) {
    return (
      <div className="bg-card-taupe p-8 rounded-lg border border-divider-silver text-center">
        <p className="text-text-lavender">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card-taupe p-6 rounded-lg border border-divider-silver"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div>
                    <p className="font-body font-semibold text-text-cream">
                      {review.user_email?.split('@')[0] || 'Anonymous'}
                    </p>
                    {review.is_verified_purchase && (
                      <div className="flex items-center space-x-1 mt-1">
                        <FaCheckCircle className="text-green-500 text-xs" />
                        <span className="text-xs text-text-lavender">Verified Purchase</span>
                      </div>
                    )}
                  </div>
                </div>
                <ReviewRating rating={review.rating} size="sm" showValue={false} />
                <p className="text-xs text-text-lavender mt-1">
                  {formatDate(review.created_at)}
                </p>
              </div>

              {/* Action Buttons */}
              {isLoggedIn && (user?.id === review.user_id || user?.role === 'admin') && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDelete(review.id)}
                    disabled={deletingId === review.id}
                    className="text-text-lavender hover:text-highlight-wine transition-colors disabled:opacity-50"
                    aria-label="Delete review"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>

            {/* Review Title */}
            {review.title && (
              <h4 className="font-body font-semibold text-text-cream mb-2">
                {review.title}
              </h4>
            )}

            {/* Review Comment */}
            {review.comment && (
              <p className="font-body text-text-lavender leading-relaxed mb-4">
                {review.comment}
              </p>
            )}

            {/* Helpful Button */}
            <div className="flex items-center space-x-4 pt-4 border-t border-divider-silver">
              <button
                onClick={() => handleMarkHelpful(review.id)}
                disabled={helpfulReviews.has(review.id)}
                className={`
                  flex items-center space-x-2 px-3 py-1 rounded transition-colors
                  ${helpfulReviews.has(review.id)
                    ? 'bg-cta-copper/20 text-cta-copper cursor-default'
                    : 'text-text-lavender hover:text-cta-copper hover:bg-cta-copper/10'
                  }
                `}
              >
                <FaThumbsUp />
                <span className="text-sm">
                  Helpful {review.helpful_count > 0 && `(${review.helpful_count})`}
                </span>
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

