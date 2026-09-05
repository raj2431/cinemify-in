const { Op } = require('sequelize');
const { WatchProgress, Content, Episode, Genre } = require('../models');

const MIN_RESUMABLE_SECONDS = 10;
const NEAR_END_REMAINING_SECONDS = 30;

const listProgress = async (req, res) => {
  try {
    const entries = await WatchProgress.findAll({
      where: {
        profileId: req.profile.id,
        positionSeconds: { [Op.gte]: MIN_RESUMABLE_SECONDS },
      },
      order: [['updatedAt', 'DESC']],
      limit: 20,
      include: [
        { model: Content, include: [{ model: Genre, as: 'genres', through: { attributes: [] } }] },
        { model: Episode, attributes: ['id', 'title', 'season', 'episodeNumber'] },
      ],
    });

    const items = entries
      .filter((e) => !e.durationSeconds || e.durationSeconds - e.positionSeconds > NEAR_END_REMAINING_SECONDS)
      .map((e) => ({
        ...e.Content.toJSON(),
        progress: {
          positionSeconds: e.positionSeconds,
          durationSeconds: e.durationSeconds,
          episode: e.Episode || null,
        },
      }));

    return res.json(items);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch watch progress', error: err.message });
  }
};

const upsertProgress = async (req, res) => {
  try {
    const { contentId, episodeId, positionSeconds, durationSeconds } = req.body;

    const where = {
      profileId: req.profile.id,
      contentId,
      episodeId: episodeId || null,
    };

    const existing = await WatchProgress.findOne({ where });
    if (existing) {
      await existing.update({ positionSeconds, durationSeconds });
      return res.json(existing);
    }

    const created = await WatchProgress.create({ ...where, positionSeconds, durationSeconds });
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to save watch progress', error: err.message });
  }
};

const getProgressForContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const episodeId = req.query.episodeId || null;
    const entry = await WatchProgress.findOne({
      where: { profileId: req.profile.id, contentId, episodeId },
    });
    return res.json(entry || null);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch watch progress', error: err.message });
  }
};

const deleteProgress = async (req, res) => {
  try {
    const { contentId } = req.params;
    await WatchProgress.destroy({ where: { profileId: req.profile.id, contentId } });
    return res.json({ message: 'Removed from continue watching' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to remove watch progress', error: err.message });
  }
};

module.exports = { listProgress, upsertProgress, getProgressForContent, deleteProgress };
