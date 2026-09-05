const express = require('express');
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require('../controllers/watchlistController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getWatchlist);
router.post('/:contentId', protect, addToWatchlist);
router.delete('/:contentId', protect, removeFromWatchlist);

module.exports = router;
