import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { riceService } from '../services/riceService';
import { reviewService } from '../services/reviewService';
import type { Rice, Review, GetReviewsParams, CreateReviewRequest } from '../types';
import Header from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function RiceDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rice, setRice] = useState<Rice | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating_high' | 'rating_low'>('recent');
  const [hasMoreReviews, setHasMoreReviews] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Review form state
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (id) {
      loadRice(parseInt(id));
      loadReviews(parseInt(id), { sort_by: sortBy });
    }
  }, [id]);

  const loadRice = async (riceId: number) => {
    try {
      setLoading(true);
      const riceData = await riceService.getRiceById(riceId);
      setRice(riceData);
    } catch (err) {
      setError('Failed to load rice details');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async (
    riceId: number,
    params: GetReviewsParams = {},
    append: boolean = false
  ) => {
    try {
      setReviewsLoading(true);
      const skip = append ? reviews.length : 0;
      const reviewsData = await reviewService.getRiceReviews(riceId, {
        ...params,
        skip,
        limit: 20,
      });

      if (append) {
        setReviews((prev) => [...prev, ...reviewsData]);
      } else {
        setReviews(reviewsData);
      }

      setHasMoreReviews(reviewsData.length === 20);
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (rating === 0) {
      setFormError('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      setFormError('Please write a comment');
      return;
    }

    try {
      setSubmitting(true);
      setFormError('');
      const newReview = await reviewService.createReview(parseInt(id), { rating, comment: comment.trim() });
      setReviews((prev) => [newReview, ...prev]);
      setShowReviewForm(false);
      setRating(0);
      setComment('');
      loadRice(parseInt(id));
    } catch (err: any) {
      setFormError(err.response?.data?.detail || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSortChange = (newSortBy: 'recent' | 'helpful' | 'rating_high' | 'rating_low') => {
    setSortBy(newSortBy);
    if (id) {
      loadReviews(parseInt(id), { sort_by: newSortBy });
    }
  };

  const handleLoadMore = () => {
    if (id && !reviewsLoading) {
      loadReviews(parseInt(id), { sort_by: sortBy }, true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-6" />
          <Card>
            <CardHeader>
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-2/3" />
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (error || !rice) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>{error || 'Rice not found'}</AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/')} className="mt-4">
            Back to Home
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          ← Back to Home
        </Button>

        {/* Rice Header Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-3xl">{rice.name}</CardTitle>

            {/* Poster Info */}
            {rice.poster_name && (
              <div
                onClick={() => navigate(`/user/${rice.user_id}`)}
                className="flex items-center gap-3 cursor-pointer hover:opacity-80 w-fit mt-2"
              >
                <Avatar className="h-10 w-10">
                  {rice.poster_avatar ? (
                    <AvatarImage src={rice.poster_avatar} alt={rice.poster_name} />
                  ) : null}
                  <AvatarFallback>{rice.poster_name[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-muted-foreground">Posted by</p>
                  <p className="font-medium">{rice.poster_name}</p>
                </div>
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span><strong>Views:</strong> {rice.views}</span>
              <span><strong>Reviews:</strong> {rice.reviews_count}</span>
              {rice.avg_rating && (
                <Badge variant="secondary" className="gap-1">
                  <span className="text-yellow-500">★</span>
                  {rice.avg_rating.toFixed(1)}
                </Badge>
              )}
              <span><strong>Dotfile Clicks:</strong> {rice.dotfile_clicks}</span>
            </div>

            <Separator />

            {/* Dates */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span><strong>Created:</strong> {new Date(rice.date_added).toLocaleDateString()}</span>
              {rice.date_updated && (
                <span><strong>Updated:</strong> {new Date(rice.date_updated).toLocaleDateString()}</span>
              )}
            </div>

            <Separator />

            {/* Dotfile Link */}
            <Button asChild>
              <a href={rice.dotfile_url} target="_blank" rel="noopener noreferrer">
                View Dotfiles →
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Themes Section */}
        {rice.themes && rice.themes.length > 0 && (
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold">Themes ({rice.themes.length})</h2>

            {rice.themes.map((theme) => (
              <Card key={theme.id}>
                <CardHeader>
                  <CardTitle>{theme.name}</CardTitle>
                  {theme.description && (
                    <CardDescription>{theme.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {/* Tags */}
                  {theme.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {theme.tags.split(',').map((tag, idx) => (
                        <Badge key={idx} variant="outline">{tag.trim()}</Badge>
                      ))}
                    </div>
                  )}

                  {/* Media Gallery */}
                  {theme.media && theme.media.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {theme.media.map((media) => (
                        <div key={media.id} className="relative group">
                          {media.media_type === 'IMAGE' ? (
                            <img
                              src={media.media_url}
                              alt={`${theme.name} media`}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center">
                              <span className="text-muted-foreground">Video</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Themes */}
        {(!rice.themes || rice.themes.length === 0) && (
          <Card className="mb-8">
            <CardContent className="py-8 text-center text-muted-foreground">
              No themes available for this rice yet.
            </CardContent>
          </Card>
        )}

        {/* Reviews Section */}
        <div className="space-y-6">
          {/* Write Review Button */}
          {!showReviewForm && (
            <Button onClick={() => setShowReviewForm(true)}>
              Write a Review
            </Button>
          )}

          {/* Review Form */}
          {showReviewForm && (
            <Card>
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateReview} className="space-y-4">
                  {/* Rating Input */}
                  <div>
                    <Label>Rating *</Label>
                    <div className="flex gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="text-3xl transition-colors focus:outline-none"
                        >
                          <span className={star <= (hoveredRating || rating) ? 'text-yellow-500' : 'text-muted'}>
                            ★
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment Input */}
                  <div>
                    <Label htmlFor="comment">Comment *</Label>
                    <Textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      placeholder="Share your thoughts about this rice..."
                      disabled={submitting}
                      className="mt-2"
                    />
                  </div>

                  {/* Error */}
                  {formError && (
                    <Alert variant="destructive">
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <Button type="submit" disabled={submitting}>
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)} disabled={submitting}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Reviews List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Reviews ({rice.reviews_count || 0})</CardTitle>
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Sort by:</Label>
                  <Select value={sortBy} onValueChange={(v) => handleSortChange(v as any)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="helpful">Most Helpful</SelectItem>
                      <SelectItem value="rating_high">Highest Rating</SelectItem>
                      <SelectItem value="rating_low">Lowest Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {reviews.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.username}</span>
                          <Badge variant="secondary">
                            {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.date_created).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm">{review.comment}</p>
                      {review.helpful_count > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {review.helpful_count} found this helpful
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Load More */}
              {hasMoreReviews && reviews.length > 0 && (
                <div className="mt-6 text-center">
                  <Button onClick={handleLoadMore} disabled={reviewsLoading} variant="outline">
                    {reviewsLoading ? 'Loading...' : 'Load More Reviews'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}