const express = require('express');
const connect = require('./config/db');
const products = require('./routes/products');
const rating = require('./routes/rating');
const users = require('./routes/login.js');
const comments = require('./routes/comments.js');
const orders = require('./routes/orders.js');
const app = express();
const cors = require('cors');



//  CORS
const whitelist = 
["http://192.168.1.8:5173", "http://172.27.16.1:5173/", "http://172.0.0.1:5173/", "http://localhost:5173/"]
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

app.enable('trust proxy');
app.use(cors());
app.use(express.json());

connect(); //database connection
app.use('/products', products);
app.use('/rating', rating);
app.use('/comments', comments);
app.use('/users', users);
app.use('/orders', orders);

const port = process.env.PORT || 3000;
app.listen(port,
    () => console.log(`La aplicación está
corriendo en http://localhost:${3000}`)
);
module.exports = app;
