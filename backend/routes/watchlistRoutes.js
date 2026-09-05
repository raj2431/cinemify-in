const express = require('express');
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require('../controllers/watchlistController');
const { protect } = require('../middleware/auth');
const { requireOwnedProfile } = require('../middleware/profileOwnership');
const validate = require('../middleware/validate');
const { contentIdParamValidator } = require('../validators/watchlistValidators');

const router = express.Router();

router.get('/', protect, requireOwnedProfile, getWatchlist);
router.post('/:contentId', protect, contentIdParamValidator, validate, requireOwnedProfile, addToWatchlist);
router.delete('/:contentId', protect, contentIdParamValidator, validate, requireOwnedProfile, removeFromWatchlist);

module.exports = router;
