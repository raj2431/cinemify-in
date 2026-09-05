const express = require('express');
const { listProgress, upsertProgress, getProgressForContent, deleteProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');
const { requireOwnedProfile } = require('../middleware/profileOwnership');
const validate = require('../middleware/validate');
const { upsertProgressValidator, contentIdParamValidator } = require('../validators/progressValidators');

const router = express.Router();

router.get('/', protect, requireOwnedProfile, listProgress);
router.put('/', protect, upsertProgressValidator, validate, requireOwnedProfile, upsertProgress);
router.get('/:contentId', protect, contentIdParamValidator, validate, requireOwnedProfile, getProgressForContent);
router.delete('/:contentId', protect, contentIdParamValidator, validate, requireOwnedProfile, deleteProgress);

module.exports = router;
