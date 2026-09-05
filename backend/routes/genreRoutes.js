const express = require('express');
const { listGenres, createGenre, deleteGenre } = require('../controllers/genreController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

const router = express.Router();

router.get('/', listGenres);
router.post('/', protect, admin, createGenre);
router.delete('/:id', protect, admin, deleteGenre);

module.exports = router;
