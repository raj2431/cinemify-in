const { Op } = require('sequelize');
const { Content, Genre, Episode } = require('../models');

const includeGenres = { model: Genre, as: 'genres', through: { attributes: [] } };

const listContent = async (req, res) => {
  try {
    const { search, genre, type, featured, limit, page } = req.query;

    const where = {};
    if (search) {
      where.title = { [Op.like]: `%${search}%` };
    }
    if (type) {
      where.type = type;
    }
    if (featured !== undefined) {
      where.featured = featured === 'true';
    }

    const pageSize = Math.min(parseInt(limit, 10) || 24, 100);
    const pageNum = Math.max(parseInt(page, 10) || 1, 1);

    const queryOptions = {
      where,
      include: [includeGenres],
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: (pageNum - 1) * pageSize,
      distinct: true,
    };

    if (genre) {
      queryOptions.include[0].where = { name: genre };
    }

    const { rows, count } = await Content.findAndCountAll(queryOptions);

    return res.json({
      items: rows,
      total: count,
      page: pageNum,
      pageSize,
      totalPages: Math.ceil(count / pageSize),
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch content', error: err.message });
  }
};

const getContentById = async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id, {
      include: [
        includeGenres,
        { model: Episode, as: 'episodes', separate: true, order: [['season', 'ASC'], ['episodeNumber', 'ASC']] },
      ],
    });
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    return res.json(content);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch content', error: err.message });
  }
};

const createContent = async (req, res) => {
  try {
    const {
      title, description, type, posterUrl, bannerUrl, videoUrl, trailerUrl,
      releaseYear, durationMinutes, rating, featured, genreIds,
    } = req.body;

    if (!title || !type) {
      return res.status(400).json({ message: 'Title and type are required' });
    }

    const content = await Content.create({
      title, description, type, posterUrl, bannerUrl, videoUrl, trailerUrl,
      releaseYear, durationMinutes, rating, featured,
    });

    if (Array.isArray(genreIds) && genreIds.length) {
      await content.setGenres(genreIds);
    }

    const created = await Content.findByPk(content.id, { include: [includeGenres] });
    return res.status(201).json(created);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to create content', error: err.message });
  }
};

const updateContent = async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    const {
      title, description, type, posterUrl, bannerUrl, videoUrl, trailerUrl,
      releaseYear, durationMinutes, rating, featured, genreIds,
    } = req.body;

    await content.update({
      title, description, type, posterUrl, bannerUrl, videoUrl, trailerUrl,
      releaseYear, durationMinutes, rating, featured,
    });

    if (Array.isArray(genreIds)) {
      await content.setGenres(genreIds);
    }

    const updated = await Content.findByPk(content.id, { include: [includeGenres] });
    return res.json(updated);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update content', error: err.message });
  }
};

const deleteContent = async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    await content.destroy();
    return res.json({ message: 'Content deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete content', error: err.message });
  }
};

// Episode management (for series)
const addEpisode = async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    if (content.type !== 'series') {
      return res.status(400).json({ message: 'Episodes can only be added to series' });
    }

    const { season, episodeNumber, title, description, videoUrl, durationMinutes } = req.body;
    if (!episodeNumber || !title || !videoUrl) {
      return res.status(400).json({ message: 'episodeNumber, title and videoUrl are required' });
    }

    const episode = await Episode.create({
      contentId: content.id, season: season || 1, episodeNumber, title, description, videoUrl, durationMinutes,
    });
    return res.status(201).json(episode);
  } catch (err) {
    return res.status(500).json({ message: 'Failed to add episode', error: err.message });
  }
};

const deleteEpisode = async (req, res) => {
  try {
    const episode = await Episode.findOne({ where: { id: req.params.episodeId, contentId: req.params.id } });
    if (!episode) {
      return res.status(404).json({ message: 'Episode not found' });
    }
    await episode.destroy();
    return res.json({ message: 'Episode deleted' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete episode', error: err.message });
  }
};

module.exports = {
  listContent,
  getContentById,
  createContent,
  updateContent,
  deleteContent,
  addEpisode,
  deleteEpisode,
};
