const { body } = require('express-validator');

const reviewValidator = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('rating must be between 1 and 5'),
  body('comment').optional({ nullable: true }).isString().isLength({ max: 2000 }),
];

module.exports = { reviewValidator };
