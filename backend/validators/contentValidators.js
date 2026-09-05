const { body, param, query } = require('express-validator');

const isUrlOrEmpty = (value) => {
  if (value === undefined || value === null || value === '') return true;
  return /^https?:\/\/.+/i.test(value);
};

const contentValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 255 }),
  body('description').optional({ nullable: true }).isString(),
  body('type').isIn(['movie', 'series']).withMessage('Type must be movie or series'),
  body('posterUrl').optional({ nullable: true }).custom(isUrlOrEmpty).withMessage('posterUrl must be a valid URL'),
  body('bannerUrl').optional({ nullable: true }).custom(isUrlOrEmpty).withMessage('bannerUrl must be a valid URL'),
  body('videoUrl').optional({ nullable: true }).custom(isUrlOrEmpty).withMessage('videoUrl must be a valid URL'),
  body('trailerUrl').optional({ nullable: true }).custom(isUrlOrEmpty).withMessage('trailerUrl must be a valid URL'),
  body('releaseYear').optional({ nullable: true }).isInt({ min: 1888, max: 2100 }).withMessage('releaseYear must be a valid year'),
  body('durationMinutes').optional({ nullable: true }).isInt({ min: 0 }).withMessage('durationMinutes must be a positive number'),
  body('rating').optional({ nullable: true }).isFloat({ min: 0, max: 10 }).withMessage('rating must be between 0 and 10'),
  body('featured').optional().isBoolean().withMessage('featured must be true or false'),
  body('genreIds').optional().isArray().withMessage('genreIds must be an array'),
  body('genreIds.*').optional().isInt().withMessage('genreIds must contain valid ids'),
];

const idParamValidator = [param('id').isInt().withMessage('Invalid id')];

const episodeIdParamValidator = [
  param('id').isInt().withMessage('Invalid id'),
  param('episodeId').isInt().withMessage('Invalid episode id'),
];

const episodeValidator = [
  body('season').optional().isInt({ min: 1 }).withMessage('season must be a positive integer'),
  body('episodeNumber').isInt({ min: 1 }).withMessage('episodeNumber is required and must be a positive integer'),
  body('title').trim().notEmpty().withMessage('Episode title is required').isLength({ max: 255 }),
  body('description').optional({ nullable: true }).isString(),
  body('videoUrl').notEmpty().withMessage('videoUrl is required').custom(isUrlOrEmpty).withMessage('videoUrl must be a valid URL'),
  body('durationMinutes').optional({ nullable: true }).isInt({ min: 0 }).withMessage('durationMinutes must be a positive number'),
];

const listContentValidator = [
  query('type').optional().isIn(['movie', 'series']),
  query('featured').optional().isBoolean(),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('page').optional().isInt({ min: 1 }),
];

module.exports = {
  contentValidator,
  idParamValidator,
  episodeIdParamValidator,
  episodeValidator,
  listContentValidator,
};
