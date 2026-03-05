import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { UserCollection } from '../db/user.js';
import { SessionCollection } from '../db/session.js';
import { env } from '../utils/env.js';

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
