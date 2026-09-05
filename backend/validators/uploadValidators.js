const { body } = require('express-validator');

const presignValidator = [
  body('fileName').trim().notEmpty().withMessage('fileName is required'),
  body('fileType').trim().notEmpty().withMessage('fileType is required'),
  body('kind').isIn(['poster', 'banner', 'trailer', 'video']).withMessage('kind must be poster, banner, trailer or video'),
];

module.exports = { presignValidator };
