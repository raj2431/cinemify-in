const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WatchProgress = sequelize.define('WatchProgress', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  profileId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  contentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  episodeId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  positionSeconds: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  durationSeconds: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'watch_progress',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['profileId', 'contentId', 'episodeId'] },
  ],
});

module.exports = WatchProgress;
