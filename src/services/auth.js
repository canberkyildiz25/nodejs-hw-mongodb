import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import createHttpError from 'http-errors';
import { UserCollection } from '../db/user.js';
import { SessionCollection } from '../db/session.js';
import { env } from '../utils/env.js';
import { sendMail, renderTemplate } from '../utils/sendMail.js';

const createSession = (userId) => {
  const accessToken = jwt.sign({ id: userId }, env('JWT_ACCESS_SECRET'), {
    expiresIn: env('JWT_ACCESS_EXPIRY', '15m'),
  });

  const refreshToken = jwt.sign({ id: userId }, env('JWT_REFRESH_SECRET'), {
    expiresIn: env('JWT_REFRESH_EXPIRY', '30d'),
  });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return { accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil };
};

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await UserCollection.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserCollection.create({ name, email, password: hashedPassword });

  const sessionData = createSession(user._id);
  const session = await SessionCollection.create({ userId: user._id, ...sessionData });

  return { user, session };
};

export const loginUser = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const sessionData = createSession(user._id);
  const session = await SessionCollection.create({ userId: user._id, ...sessionData });

  return session;
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findOne({ _id: sessionId, refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Refresh token is expired');
  }

  await SessionCollection.deleteOne({ _id: sessionId });

  const sessionData = createSession(session.userId);
  return SessionCollection.create({ userId: session.userId, ...sessionData });
};

export const requestResetPassword = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  await UserCollection.updateOne({ _id: user._id }, { resetToken, resetTokenExpiry });

  const resetLink = `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`;

  const html = await renderTemplate('reset-password', { name: user.name, resetLink });

  await sendMail({
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const resetPassword = async ({ token, password }) => {
  const user = await UserCollection.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() },
  });

  if (!user) {
    throw createHttpError(401, 'Token is expired or invalid');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await UserCollection.updateOne(
    { _id: user._id },
    { password: hashedPassword, resetToken: null, resetTokenExpiry: null },
  );

  await SessionCollection.deleteMany({ userId: user._id });
};
