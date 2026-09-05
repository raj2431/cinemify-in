const { Profile } = require('../models');

const requireOwnedProfile = async (req, res, next) => {
  const profileId = req.body.profileId || req.query.profileId;
  if (!profileId) {
    return res.status(400).json({ message: 'profileId is required' });
  }

  const profile = await Profile.findOne({ where: { id: profileId, userId: req.user.id } });
  if (!profile) {
    return res.status(403).json({ message: 'Profile not found or not owned by this account' });
  }

  req.profile = profile;
  next();
};

module.exports = { requireOwnedProfile };
