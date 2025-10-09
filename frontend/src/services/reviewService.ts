import { api } from './api';
import type { Review, CreateReviewRequest, GetReviewsParams, UpdateReviewRequest } from '../types';

export const reviewService = {
  // Get reviews for a rice
  getRiceReviews: async (
    riceId: number,
    params: GetReviewsParams = {}
  ): Promise<Review[]> => {
    const { skip = 0, limit = 20, sort_by = 'recent' } = params;
    const response = await api.get(`/reviews/rice/${riceId}`, {
      params: { skip, limit, sort_by },
    });
    console.log('Fetched reviews:', response.data);
    return response.data;
  },

  updateReview: async (reviewId: number, data: UpdateReviewRequest): Promise<Review> => {
    const response = await api.patch(`/reviews/${reviewId}`, data);
    return response.data;
  },

  deleteReview: async (reviewId: number): Promise<void> => {
    await api.delete(`/reviews/${reviewId}`);
  },

  // Create a review
  createReview: async (
    riceId: number,
    reviewData: CreateReviewRequest
  ): Promise<Review> => {
    const response = await api.post(
      `/reviews/rice/${riceId}`,
      reviewData
    );
    return response.data;
  },
};

