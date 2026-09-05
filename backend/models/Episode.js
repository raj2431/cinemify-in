const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Episode = sequelize.define('Episode', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  contentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  season: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  episodeNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  videoUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  durationMinutes: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'episodes',
  timestamps: true,
});

module.exports = Episode;
