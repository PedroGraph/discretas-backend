const express = require('express');
const profesoresRoutes = require('../routes/profesores');
const app = express();
app.use(express.json());
app.use('/profesores', profesoresRoutes);

const server = app.listen( () => console.log(`Server running on testmode`));
module.exports = server;