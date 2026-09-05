const express = require('express');
const {
  listContent, getContentById, createContent, updateContent, deleteContent,
  addEpisode, deleteEpisode,
} = require('../controllers/contentController');
const { listReviews, upsertReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const validate = require('../middleware/validate');
const {
  contentValidator, idParamValidator, episodeIdParamValidator, episodeValidator, listContentValidator,
} = require('../validators/contentValidators');
const { reviewValidator } = require('../validators/reviewValidators');

const router = express.Router();

router.get('/', listContentValidator, validate, listContent);
router.get('/:id', idParamValidator, validate, getContentById);
router.post('/', protect, admin, contentValidator, validate, createContent);
router.put('/:id', protect, admin, idParamValidator, contentValidator, validate, updateContent);
router.delete('/:id', protect, admin, idParamValidator, validate, deleteContent);

router.post('/:id/episodes', protect, admin, idParamValidator, episodeValidator, validate, addEpisode);
router.delete('/:id/episodes/:episodeId', protect, admin, episodeIdParamValidator, validate, deleteEpisode);

router.get('/:id/reviews', idParamValidator, validate, listReviews);
router.post('/:id/reviews', protect, idParamValidator, reviewValidator, validate, upsertReview);
router.delete('/:id/reviews', protect, idParamValidator, validate, deleteReview);

module.exports = router;
