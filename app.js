const express = require('express');
const connect = require('./config/db');
const products = require('./routes/products');
const rating = require('./routes/rating');
const app = express();
const cors = require('cors');


//  CORS
const whitelist = 
["http://192.168.1.8:5173", "http://172.27.16.1:5173/", "http://172.0.0.1:5173/", "https://discretas-frontend.vercel.app/","https://main--bejewelled-tartufo-4f250c.netlify.app/"]
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin)) {
      //  API
      callback(null, true);
    } else {
      console.log('Cors error:');
      callback(new Error("Error de Cors"));
    }
  },
};

app.enable('trust proxy');
app.use(cors());

connect();
app.use(express.json());
app.use('/products', products);
app.use('/rating', rating);

const port = process.env.PORT || 3000;
app.listen(port,
    () => console.log(`La aplicación está
corriendo en http://localhost:${3000}`)
);
module.exports = app;
