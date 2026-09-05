const { body, param } = require('express-validator');

const genreValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 255 }),
];

const idParamValidator = [param('id').isInt().withMessage('Invalid id')];

module.exports = { genreValidator, idParamValidator };
