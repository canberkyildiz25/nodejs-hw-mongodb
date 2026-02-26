import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { router } from './routers/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { env } from './utils/env.js';

const pinoOptions =
  env('NODE_ENV', 'development') === 'production'
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
          },
        },
      };

const logger = pino(pinoOptions);

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(pinoHttp({ logger }));

  app.use(router);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export const startServer = () => {
  const PORT = Number(env('PORT', '3000'));
  const app = setupServer();

  app.listen(PORT, () => {
    logger.info({ port: PORT }, 'Server started');
  });
};
