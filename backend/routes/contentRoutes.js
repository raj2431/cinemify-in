const express = require('express');
const {
  listContent, getContentById, createContent, updateContent, deleteContent,
  addEpisode, deleteEpisode,
} = require('../controllers/contentController');
const { protect } = require('../middleware/auth');
const { admin } = require('../middleware/admin');

const router = express.Router();

router.get('/', listContent);
router.get('/:id', getContentById);
router.post('/', protect, admin, createContent);
router.put('/:id', protect, admin, updateContent);
router.delete('/:id', protect, admin, deleteContent);

router.post('/:id/episodes', protect, admin, addEpisode);
router.delete('/:id/episodes/:episodeId', protect, admin, deleteEpisode);

module.exports = router;
