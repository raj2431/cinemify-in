const express = require('express');
const { listProfiles, createProfile, updateProfile, deleteProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { profileValidator, idParamValidator } = require('../validators/profileValidators');

const router = express.Router();

router.get('/', protect, listProfiles);
router.post('/', protect, profileValidator, validate, createProfile);
router.put('/:id', protect, idParamValidator, profileValidator, validate, updateProfile);
router.delete('/:id', protect, idParamValidator, validate, deleteProfile);

module.exports = router;
