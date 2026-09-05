const { Genre } = require('../models');

const listGenres = async (req, res) => {
  try {
    const genres = await Genre.findAll({ order: [['name', 'ASC']] });
    return res.json(genres);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch genres', error: err.message });
  }
};

const createGenre = async (req, res) => {
  try {
    const { name } = req.body;
    const existing = await Genre.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({ message: 'Genre already exists' });
    }
    const genre = await Genre.create({ name });
    return res.status(201).json(genre);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create genre', error: err.message });
  }
};

const deleteGenre = async (req, res) => {
  try {
    const genre = await Genre.findByPk(req.params.id);
    if (!genre) {
      return res.status(404).json({ message: 'Genre not found' });
    }
    await genre.destroy();
    return res.json({ message: 'Genre deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete genre', error: err.message });
  }
};

module.exports = { listGenres, createGenre, deleteGenre };
