const express = require('express');
const { presignUpload } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');
const validate = require('../middleware/validate');
const { presignValidator } = require('../validators/uploadValidators');

const router = express.Router();

router.post('/presign', protect, admin, presignValidator, validate, presignUpload);

module.exports = router;
