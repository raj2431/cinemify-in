const { RefreshToken } = require('../models');
const { generateAccessToken, generateRefreshToken } = require('./generateToken');

const REFRESH_TOKEN_COOKIE = 'refreshToken';
const REFRESH_TOKEN_DAYS = parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN_DAYS, 10) || 30;

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api/auth',
  maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
});

const issueTokens = async (res, userId) => {
  const accessToken = generateAccessToken(userId);
  const { token, tokenHash } = generateRefreshToken();

  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);
  await RefreshToken.create({ userId, tokenHash, expiresAt });

  res.cookie(REFRESH_TOKEN_COOKIE, token, cookieOptions());
  return accessToken;
};

const clearRefreshCookie = (res) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE, { ...cookieOptions(), maxAge: undefined });
};

module.exports = { issueTokens, clearRefreshCookie, REFRESH_TOKEN_COOKIE };
