import { useState } from 'react';
import type { Review, UpdateReviewRequest } from '../types';
import { reviewService } from '../services/reviewService';

interface ReviewCardProps {
  review: Review;
  currentUserId?: number;
  onUpdate?: (reviewId: number, updatedReview: Review) => void;
  onDelete?: (reviewId: number) => void;
}

export default function ReviewCard({ review, currentUserId, onUpdate, onDelete }: ReviewCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const [loading, setLoading] = useState(false);

  const isOwner = currentUserId === review.user_id;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const updateData: UpdateReviewRequest = { rating, comment };
      const updatedReview = await reviewService.updateReview(review.id, updateData);
      onUpdate?.(review.id, updatedReview);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update review', err);
      alert('Failed to update review');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      setLoading(true);
      await reviewService.deleteReview(review.id);
      onDelete?.(review.id);
    } catch (err) {
      console.error('Failed to delete review', err);
      alert('Failed to delete review');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setRating(review.rating);
    setComment(review.comment);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="text-2xl focus:outline-none"
                >
                  <span className={star <= rating ? 'text-yellow-500' : 'text-gray-300'}>
                    ★
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              placeholder="Share your thoughts..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
            {review.username?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-medium text-gray-900">{review.username || 'Anonymous'}</p>
            <p className="text-sm text-gray-500">{formatDate(review.date_created)}</p>
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`text-lg ${
                star <= review.rating ? 'text-yellow-500' : 'text-gray-300'
              }`}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      {/* Comment */}
      <p className="text-gray-700 mb-3">{review.comment}</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Helpful Count */}
        {review.helpful_count > 0 && (
          <div className="text-sm text-gray-500">
            {review.helpful_count} {review.helpful_count === 1 ? 'person' : 'people'} found this helpful
          </div>
        )}

        {/* Actions for owner */}
        {isOwner && (
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 disabled:cursor-not-allowed"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}