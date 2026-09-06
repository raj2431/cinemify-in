require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models');
const { apiLimiter } = require('./middleware/rateLimit');

const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const genreRoutes = require('./routes/genreRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');
const profileRoutes = require('./routes/profileRoutes');
const progressRoutes = require('./routes/progressRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

app.use('/api/health', healthRoutes);

app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/uploads', uploadRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connection established.');
    await sequelize.sync({ alter: true });
    console.log('Models synced.');
    app.listen(PORT, HOST, () => console.log(`Cinemify API running on ${HOST}:${PORT}`));
  } catch (err) {
    console.error('Unable to start server:', err.message);
    process.exit(1);
  }
};

start();
