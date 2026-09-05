const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Watchlist = sequelize.define('Watchlist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  contentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'watchlist',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['userId', 'contentId'] },
  ],
});

module.exports = Watchlist;
