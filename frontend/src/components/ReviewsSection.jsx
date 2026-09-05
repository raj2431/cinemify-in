import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';

export default function ReviewsSection({ contentId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    api.get(`/content/${contentId}/reviews`).then((res) => {
      setReviews(res.data.reviews);
      setAverageRating(res.data.averageRating);
      setReviewCount(res.data.reviewCount);
      const mine = user && res.data.reviews.find((r) => r.userId === user.id);
      if (mine) {
        setMyRating(mine.rating);
        setMyComment(mine.comment || '');
      }
    }).catch(console.error);
  };

  useEffect(load, [contentId, user]);

  const submitReview = async (e) => {
    e.preventDefault();
    if (!myRating) {
      setError('Please select a star rating');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await api.post(`/content/${contentId}/reviews`, { rating: myRating, comment: myComment });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async () => {
    await api.delete(`/content/${contentId}/reviews`);
    setMyRating(0);
    setMyComment('');
    load();
  };

  const myReviewExists = user && reviews.some((r) => r.userId === user.id);

  return (
    <div className="reviews-section">
      <h2>
        Ratings & Reviews
        {averageRating !== null && (
          <span className="reviews-average"> · ★ {averageRating} ({reviewCount} review{reviewCount === 1 ? '' : 's'})</span>
        )}
      </h2>

      {user && (
        <form className="review-form" onSubmit={submitReview}>
          <StarRating value={myRating} onChange={setMyRating} />
          <textarea
            placeholder="Share your thoughts (optional)"
            value={myComment}
            onChange={(e) => setMyComment(e.target.value)}
            rows={2}
          />
          {error && <p className="form-error">{error}</p>}
          <div className="review-form-actions">
            <button type="submit" className="btn-secondary" disabled={submitting}>
              {myReviewExists ? 'Update Review' : 'Submit Review'}
            </button>
            {myReviewExists && (
              <button type="button" className="btn-secondary" onClick={deleteReview}>Delete</button>
            )}
          </div>
        </form>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="reviews-empty">No reviews yet. Be the first to review this title.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="review-item">
              <div className="review-item-header">
                <strong>{r.User?.name || 'User'}</strong>
                <StarRating value={r.rating} readOnly />
              </div>
              {r.comment && <p>{r.comment}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
