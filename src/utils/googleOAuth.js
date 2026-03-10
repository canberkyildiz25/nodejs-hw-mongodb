import { OAuth2Client } from 'google-auth-library';
import createHttpError from 'http-errors';
import { env } from './env.js';

const googleOAuthClient = new OAuth2Client({
  clientId: env('GOOGLE_CLIENT_ID'),
  clientSecret: env('GOOGLE_CLIENT_SECRET'),
  redirectUri: env('GOOGLE_REDIRECT_URI'),
});

export const generateAuthUrl = () =>
  googleOAuthClient.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });

export const validateCode = async (code) => {
  const response = await googleOAuthClient.getToken(code);
  if (!response.tokens.id_token) throw createHttpError(401, 'Unauthorized');

  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: response.tokens.id_token,
  });
  return ticket;
};

export const getFullNameFromGoogleTokenPayload = (payload) => {
  if (payload.given_name && payload.family_name) {
    return `${payload.given_name} ${payload.family_name}`;
  }
  if (payload.given_name) {
    return payload.given_name;
  }
  return 'Guest';
};
