import express from 'express';
import cors from 'cors';
import { createClient } from 'redis';
import { mainRoutes } from './routes/mainRoutes.js';
import syncDatabase from './models/postgres/mainModels.js';

const redisClient = createClient({
  password: 'tLbYmGhlgNJFmGJIcSpkM9dWjzRW8FgK',
  socket: {
    host: 'redis-12924.c258.us-east-1-4.ec2.redns.redis-cloud.com',
    port: 12924
  }
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

export const mainApp = async (models) => {
  const app = express();
  syncDatabase();

  // Conectar a Redis
  await redisClient.connect();

  // Configuración básica de Express
  app.enable('trust proxy');
  app.use(express.json());

  // Configuración de CORS
  const corsOptions = {
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true, // Permitir el envío de cookies
  };
  
  app.use(cors(corsOptions));

  // Configuración de rutas principales
  mainRoutes(app, models, redisClient);

  // Configuración del servidor y escucha del puerto
  if (!import.meta.main) {
    const port = process.env.PORT || 4000;
    app.listen(port, () =>
      console.log(`La aplicación está corriendo en http://localhost:${port}`),
    );
  }

  return app;
}

// Manejo de cierre de la aplicación
process.on('SIGINT', async () => {
  await redisClient.quit();
  process.exit(0);
});