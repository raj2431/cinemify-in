const { Review, User, Content } = require('../models');

const listReviews = async (req, res) => {
  try {
    const { id: contentId } = req.params;
    const reviews = await Review.findAll({
      where: { contentId },
      include: [{ model: User, attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });

    const reviewCount = reviews.length;
    const averageRating = reviewCount
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1))
      : null;

    return res.json({ reviews, averageRating, reviewCount });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};

const upsertReview = async (req, res) => {
  try {
    const { id: contentId } = req.params;
    const { rating, comment } = req.body;

    const content = await Content.findByPk(contentId);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    const [review] = await Review.upsert(
      { userId: req.user.id, contentId, rating, comment },
      { returning: true }
    );

    const withUser = await Review.findByPk(review.id, { include: [{ model: User, attributes: ['id', 'name'] }] });
    return res.status(201).json(withUser);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to save review', error: err.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id: contentId } = req.params;
    await Review.destroy({ where: { contentId, userId: req.user.id } });
    return res.json({ message: 'Review deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete review', error: err.message });
  }
};

module.exports = { listReviews, upsertReview, deleteReview };
