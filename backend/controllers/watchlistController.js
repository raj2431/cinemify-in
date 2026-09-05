const { Watchlist, Content, Genre } = require('../models');

const getWatchlist = async (req, res) => {
  try {
    const items = await Content.findAll({
      include: [
        { model: Genre, as: 'genres', through: { attributes: [] } },
        {
          association: 'watchlistedBy',
          where: { id: req.user.id },
          attributes: [],
          through: { attributes: [] },
        },
      ],
    });
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch watchlist', error: err.message });
  }
};

const addToWatchlist = async (req, res) => {
  try {
    const { contentId } = req.params;
    const content = await Content.findByPk(contentId);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    const [entry, created] = await Watchlist.findOrCreate({
      where: { userId: req.user.id, contentId },
    });
    return res.status(created ? 201 : 200).json(entry);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to add to watchlist', error: err.message });
  }
};

const removeFromWatchlist = async (req, res) => {
  try {
    const { contentId } = req.params;
    await Watchlist.destroy({ where: { userId: req.user.id, contentId } });
    return res.json({ message: 'Removed from watchlist' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to remove from watchlist', error: err.message });
  }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };
