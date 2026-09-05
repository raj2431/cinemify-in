const sequelize = require('../config/db');
const User = require('./User');
const Genre = require('./Genre');
const Content = require('./Content');
const Episode = require('./Episode');
const Watchlist = require('./Watchlist');
const RefreshToken = require('./RefreshToken');
const Profile = require('./Profile');
const WatchProgress = require('./WatchProgress');
const Review = require('./Review');

// Content <-> Genre (many-to-many)
Content.belongsToMany(Genre, { through: 'content_genres', as: 'genres' });
Genre.belongsToMany(Content, { through: 'content_genres', as: 'contents' });

// Content -> Episodes (one-to-many)
Content.hasMany(Episode, { foreignKey: 'contentId', as: 'episodes', onDelete: 'CASCADE' });
Episode.belongsTo(Content, { foreignKey: 'contentId' });

// User -> RefreshTokens (one-to-many)
User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens', onDelete: 'CASCADE' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

// User -> Profiles (one-to-many)
User.hasMany(Profile, { foreignKey: 'userId', as: 'profiles', onDelete: 'CASCADE' });
Profile.belongsTo(User, { foreignKey: 'userId' });

// Profile <-> Content via Watchlist (many-to-many)
Profile.belongsToMany(Content, { through: Watchlist, as: 'watchlistedContent', foreignKey: 'profileId' });
Content.belongsToMany(Profile, { through: Watchlist, as: 'watchlistedBy', foreignKey: 'contentId' });

// Profile -> WatchProgress (one-to-many)
Profile.hasMany(WatchProgress, { foreignKey: 'profileId', as: 'watchProgress', onDelete: 'CASCADE' });
WatchProgress.belongsTo(Profile, { foreignKey: 'profileId' });
Content.hasMany(WatchProgress, { foreignKey: 'contentId', as: 'watchProgressEntries', onDelete: 'CASCADE' });
WatchProgress.belongsTo(Content, { foreignKey: 'contentId' });
WatchProgress.belongsTo(Episode, { foreignKey: 'episodeId' });

// User -> Reviews, Content -> Reviews
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'userId' });
Content.hasMany(Review, { foreignKey: 'contentId', as: 'reviews', onDelete: 'CASCADE' });
Review.belongsTo(Content, { foreignKey: 'contentId' });

module.exports = {
  sequelize,
  User,
  Genre,
  Content,
  Episode,
  Watchlist,
  RefreshToken,
  Profile,
  WatchProgress,
  Review,
};
