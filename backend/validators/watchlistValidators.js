const { param } = require('express-validator');

const contentIdParamValidator = [param('contentId').isInt().withMessage('Invalid content id')];

module.exports = { contentIdParamValidator };
