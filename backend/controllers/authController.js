const bcrypt = require('bcryptjs');
const { User, RefreshToken, Profile } = require('../models');
const { issueTokens, clearRefreshCookie, REFRESH_TOKEN_COOKIE } = require('../utils/issueTokens');
const { hashToken } = require('../utils/generateToken');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });
    await Profile.create({ userId: user.id, name: user.name });
    const accessToken = await issueTokens(res, user.id);

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: accessToken,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = await issueTokens(res, user.id);

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: accessToken,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

const refresh = async (req, res) => {
  try {
    const token = req.cookies?.[REFRESH_TOKEN_COOKIE];
    if (!token) {
      return res.status(401).json({ message: 'No refresh token' });
    }

    const tokenHash = hashToken(token);
    const stored = await RefreshToken.findOne({ where: { tokenHash } });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      clearRefreshCookie(res);
      return res.status(401).json({ message: 'Refresh token invalid or expired' });
    }

    // Rotate: revoke the used token and issue a new pair
    stored.revokedAt = new Date();
    await stored.save();

    const user = await User.findByPk(stored.userId, { attributes: { exclude: ['password'] } });
    if (!user) {
      clearRefreshCookie(res);
      return res.status(401).json({ message: 'User no longer exists' });
    }

    const accessToken = await issueTokens(res, user.id);
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: accessToken,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Token refresh failed', error: err.message });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies?.[REFRESH_TOKEN_COOKIE];
    if (token) {
      const tokenHash = hashToken(token);
      await RefreshToken.update({ revokedAt: new Date() }, { where: { tokenHash, revokedAt: null } });
    }
    clearRefreshCookie(res);
    return res.json({ message: 'Logged out' });
  } catch (err) {
    return res.status(500).json({ message: 'Logout failed', error: err.message });
  }
};

const getMe = async (req, res) => {
  return res.json(req.user);
};

module.exports = { register, login, refresh, logout, getMe };
