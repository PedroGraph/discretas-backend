import express from 'express';
import cors from 'cors';
import { mainRoutes } from './routes/mainRoutes.js';
import syncDatabase from './models/database/mainModels.js';

const app = express();

// Sincroniza la base de datos
syncDatabase();

// Configuración básica de Express
app.enable('trust proxy');
app.use(express.json());

const whitelist = [
  "http://localhost:3000", "https://discretasseduccion.vercel.app"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Error de CORS: La solicitud desde', origin, 'no está permitida');
      callback(new Error("Error de CORS"));
    }
  },
  credentials: true, // Agrega esta línea para permitir el envío de cookies
};

app.use(cors(corsOptions));


app.use(cors(corsOptions));

// Configuración de rutas principales
mainRoutes(app);

// Configuración de CORS


// Configuración del servidor y escucha del puerto
if (!import.meta.main) {
  const port = process.env.PORT || 4000;
  app.listen(port, () =>
    console.log(`La aplicación está corriendo en http://localhost:${port}`),
  );
}

export default app;
