'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ReviewRating from './ReviewRating';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import CTAButton from '@/components/ui/CTAButton';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface ReviewFormProps {
  productId: number;
  orderId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ productId, orderId, onSuccess, onCancel }: ReviewFormProps) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoggedIn) {
    return (
      <div className="bg-card-taupe p-6 rounded-lg border border-divider-silver text-center">
        <p className="text-text-lavender mb-4">Please log in to write a review</p>
        <CTAButton onClick={() => router.push('/login')}>
          Log In
        </CTAButton>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await apiClient.createReview({
        product_id: productId,
        rating,
        title: title.trim() || undefined,
        comment: comment.trim() || undefined,
        order_id: orderId,
      });

      if (response.success) {
        // Reset form
        setRating(0);
        setTitle('');
        setComment('');
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(response.message || 'Failed to submit review');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card-taupe p-6 rounded-lg border border-divider-silver"
    >
      <h3 className="font-headings text-xl text-text-cream mb-4">Write a Review</h3>
      
      {/* Rating Selection */}
      <div className="mb-6">
        <label className="block text-sm font-body text-text-lavender mb-2">
          Rating <span className="text-highlight-wine">*</span>
        </label>
        <ReviewRating
          rating={rating}
          interactive={true}
          onRatingChange={setRating}
          size="lg"
        />
      </div>

      {/* Title */}
      <Input
        label="Review Title (Optional)"
        id="review-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Summarize your experience"
        maxLength={100}
      />

      {/* Comment */}
      <Textarea
        label="Your Review (Optional)"
        id="review-comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your thoughts about this product..."
        rows={5}
        maxLength={1000}
      />

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-highlight-wine/20 border border-highlight-wine rounded-lg">
          <p className="text-highlight-wine text-sm">{error}</p>
        </div>
      )}

      {/* Submit Buttons */}
      <div className="flex space-x-4">
        <CTAButton
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="flex-1"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </CTAButton>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-text-lavender hover:text-text-cream transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </motion.form>
  );
}

