const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Content = sequelize.define('Content', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  type: {
    type: DataTypes.ENUM('movie', 'series'),
    allowNull: false,
    defaultValue: 'movie',
  },
  posterUrl: {
    type: DataTypes.STRING,
  },
  bannerUrl: {
    type: DataTypes.STRING,
  },
  videoUrl: {
    type: DataTypes.STRING,
    comment: 'Used for movies; series use Episode.videoUrl instead',
  },
  trailerUrl: {
    type: DataTypes.STRING,
  },
  releaseYear: {
    type: DataTypes.INTEGER,
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
    comment: 'Movie runtime in minutes; null for series',
  },
  rating: {
    type: DataTypes.DECIMAL(3, 1),
    defaultValue: 0,
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'content',
  timestamps: true,
});

module.exports = Content;
