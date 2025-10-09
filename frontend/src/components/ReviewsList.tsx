import type { Review } from '../types';
import ReviewCard from './ReviewCard';

interface ReviewsListProps {
  reviews: Review[];
  totalReviews: number;
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  sortBy: string;
  onSortChange: (sortBy: 'recent' | 'helpful' | 'rating_high' | 'rating_low') => void;
  currentUserId?: number;
  onUpdateReview?: (reviewId: number, updatedReview: Review) => void;
  onDeleteReview?: (reviewId: number) => void;
}

export default function ReviewsList({
  reviews,
  totalReviews,
  onLoadMore,
  hasMore,
  loading,
  sortBy,
  onSortChange,
  currentUserId,
  onUpdateReview,
  onDeleteReview,
}: ReviewsListProps) {
  return (
    <div>
      {/* Header with Sort */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Reviews ({totalReviews})
        </h2>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'recent' | 'helpful' | 'rating_high' | 'rating_low')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating_high">Highest Rating</option>
            <option value="rating_low">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <ReviewCard 
              key={review.id} 
              review={review}
              currentUserId={currentUserId}
              onUpdate={onUpdateReview}
              onDelete={onDeleteReview}
            />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Load More Reviews'}
          </button>
        </div>
      )}
    </div>
  );
}