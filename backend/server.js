require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');
const genreRoutes = require('./routes/genreRoutes');
const watchlistRoutes = require('./routes/watchlistRoutes');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/watchlist', watchlistRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connection established.');
    await sequelize.sync({ alter: true });
    console.log('Models synced.');
    app.listen(PORT, () => console.log(`Cinemify API running on port ${PORT}`));
  } catch (err) {
    console.error('Unable to start server:', err.message);
    process.exit(1);
  }
};

start();
