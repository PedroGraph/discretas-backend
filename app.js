import express from 'express';
const app = express();
import {mainRoutes} from './routes/mainRoutes.js';
import cors from 'cors';

app.enable('trust proxy');
app.use(cors());
app.use(express.json());
mainRoutes(app); // Create all routes for the application

// CORS
const whitelist = [
  "http://192.168.1.8:5173", "http://172.27.16.1:5173/", "http://172.0.0.1:5173/", "http://localhost:5173/"
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Cors error:');
      callback(new Error("Error de Cors"));
    }
  },
};

if (!import.meta.main) {
  const port = process.env.PORT || 4000;
  app.listen(port, () =>
    console.log(`La aplicación está corriendo en http://localhost:${port}`),
  );
}


export default app;
