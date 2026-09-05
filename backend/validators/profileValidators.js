const { body, param } = require('express-validator');

const profileValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('avatarColor').optional({ nullable: true }).matches(/^#[0-9a-fA-F]{6}$/).withMessage('avatarColor must be a hex color'),
  body('isKids').optional().isBoolean(),
];

const idParamValidator = [param('id').isInt().withMessage('Invalid id')];

module.exports = { profileValidator, idParamValidator };
