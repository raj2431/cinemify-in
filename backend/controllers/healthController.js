const { sequelize } = require('../models');

const startedAt = Date.now();

const getHealth = (req, res) => {
  res.json({
    status: 'ok',
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
  });
};

const getReadiness = async (req, res) => {
  try {
    await sequelize.authenticate();
    return res.json({
      status: 'ok',
      database: 'up',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(503).json({
      status: 'error',
      database: 'down',
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
};

module.exports = { getHealth, getReadiness };
