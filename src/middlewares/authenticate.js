import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import { UserCollection } from '../db/user.js';
import { SessionCollection } from '../db/session.js';

const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return next(createHttpError(401, 'Authorization header is missing'));
  }

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Authorization header should be of type Bearer'));
  }

  let payload;
  try {
    payload = jwt.verify(token, env('JWT_ACCESS_SECRET'));
  } catch {
    return next(createHttpError(401, 'Token is expired or invalid'));
  }

  const session = await SessionCollection.findOne({ accessToken: token });
  if (!session) {
    return next(createHttpError(401, 'Session not found'));
  }

  if (new Date() > session.accessTokenValidUntil) {
    return next(createHttpError(401, 'Access token is expired'));
  }

  const user = await UserCollection.findById(payload.id);
  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;
  req.session = session;

  next();
};

export default authenticate;
