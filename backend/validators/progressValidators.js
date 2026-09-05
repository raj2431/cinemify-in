const { body, param, query } = require('express-validator');

const upsertProgressValidator = [
  body('profileId').isInt().withMessage('profileId is required'),
  body('contentId').isInt().withMessage('contentId is required'),
  body('episodeId').optional({ nullable: true }).isInt().withMessage('episodeId must be a valid id'),
  body('positionSeconds').isInt({ min: 0 }).withMessage('positionSeconds must be a non-negative integer'),
  body('durationSeconds').optional({ nullable: true }).isInt({ min: 0 }).withMessage('durationSeconds must be a non-negative integer'),
];

const contentIdParamValidator = [
  param('contentId').isInt().withMessage('Invalid content id'),
  query('episodeId').optional().isInt().withMessage('episodeId must be a valid id'),
];

module.exports = { upsertProgressValidator, contentIdParamValidator };
