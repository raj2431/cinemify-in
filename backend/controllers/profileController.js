const { Profile } = require('../models');

const listProfiles = async (req, res) => {
  try {
    const profiles = await Profile.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'ASC']] });
    return res.json(profiles);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch profiles', error: err.message });
  }
};

const createProfile = async (req, res) => {
  try {
    const count = await Profile.count({ where: { userId: req.user.id } });
    if (count >= 5) {
      return res.status(400).json({ message: 'Maximum of 5 profiles per account' });
    }
    const { name, avatarColor, isKids } = req.body;
    const profile = await Profile.create({ userId: req.user.id, name, avatarColor, isKids });
    return res.status(201).json(profile);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create profile', error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    const { name, avatarColor, isKids } = req.body;
    await profile.update({ name, avatarColor, isKids });
    return res.json(profile);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    const count = await Profile.count({ where: { userId: req.user.id } });
    if (count <= 1) {
      return res.status(400).json({ message: 'At least one profile is required' });
    }
    await profile.destroy();
    return res.json({ message: 'Profile deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete profile', error: err.message });
  }
};

module.exports = { listProfiles, createProfile, updateProfile, deleteProfile };
