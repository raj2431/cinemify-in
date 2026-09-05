const express = require('express');
const { listGenres, createGenre, deleteGenre } = require('../controllers/genreController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const validate = require('../middleware/validate');
const { genreValidator, idParamValidator } = require('../validators/genreValidators');

const router = express.Router();

router.get('/', listGenres);
router.post('/', protect, admin, genreValidator, validate, createGenre);
router.delete('/:id', protect, admin, idParamValidator, validate, deleteGenre);

module.exports = router;
