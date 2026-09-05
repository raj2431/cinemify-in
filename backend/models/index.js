const sequelize = require('../config/db');
const User = require('./User');
const Genre = require('./Genre');
const Content = require('./Content');
const Episode = require('./Episode');
const Watchlist = require('./Watchlist');

// Content <-> Genre (many-to-many)
Content.belongsToMany(Genre, { through: 'content_genres', as: 'genres' });
Genre.belongsToMany(Content, { through: 'content_genres', as: 'contents' });

// Content -> Episodes (one-to-many)
Content.hasMany(Episode, { foreignKey: 'contentId', as: 'episodes', onDelete: 'CASCADE' });
Episode.belongsTo(Content, { foreignKey: 'contentId' });

// User <-> Content via Watchlist (many-to-many)
User.belongsToMany(Content, { through: Watchlist, as: 'watchlistedContent', foreignKey: 'userId' });
Content.belongsToMany(User, { through: Watchlist, as: 'watchlistedBy', foreignKey: 'contentId' });

module.exports = {
  sequelize,
  User,
  Genre,
  Content,
  Episode,
  Watchlist,
};
