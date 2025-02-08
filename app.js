import express from 'express';
import cors from 'cors';
import { createClient } from 'redis';
import { mainRoutes } from './routes/mainRoutes.js';
import syncDatabase from './models/postgres/mainModels.js';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
config();

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

redisClient.on('error', (err) => { if(err.code !== 'ENOTFOUND') console.log('Redis Client Error', err) });

export const mainApp = async (models) => {
  const app = express();
  syncDatabase();


  await redisClient.connect();

  app.enable('trust proxy');
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors());

  mainRoutes(app, models, redisClient);

  if (!import.meta.main) {
    const port = process.env.PORT || 3000;
    app.listen(port, () =>
      console.log(`La aplicación está corriendo en http://localhost:${port}`),
    );
  }

  return app;
}


process.on('SIGINT', async () => {
  await redisClient.quit();
  process.exit(0);
});