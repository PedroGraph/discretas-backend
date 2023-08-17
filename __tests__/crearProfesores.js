const express = require('express');
const profesoresRoutes = require('../routes/profesores');
const app = express();
app.use(express.json());
app.use('/profesores', profesoresRoutes);

const supertest = require('supertest');
const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');
const server = require('./app');

let mongoServer;

beforeAll(async () => {

    mongoServer = await MongoMemoryServer.create();

    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },10000);
});

afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
    await new Promise(resolve => server.close(resolve));
});

describe('POST /', () => {

    it('should create a new task and return 201 status', async () => {

        const data = {

            "id":" 85544" ,
            "nombres": "ITSVAN",
            "apellidos": "ALVEAR CARABALLO",
            "tipocontrato": "Medio Tiempo",
            "genero": "masculino",
  
        };

        await supertest(server)
            .post('/profesores')
            .send(data)

            .expect(201)
            .then((response) => {


                expect(response.body.nombre).toBe(data.nombre); //




            });
    });
});
