import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import pino from 'pino';
import pinoHttp from 'pino-http';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
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

export const setupServer = async () => {
  const app = express();

  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());
  app.use(pinoHttp({ logger }));

  app.use('/api-docs', swaggerDocs());

  app.use(router);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export const startServer = async () => {
  const PORT = Number(env('PORT', '3000'));
  const app = await setupServer();

  app.listen(PORT, () => {
    logger.info({ port: PORT }, 'Server started');
  });
};
