import chai from 'chai';
import supertest from 'supertest';
import app from '../mainServer.js';
import syncDatabase from '../models/postgres/mainModels.js';
import fs from 'fs';

const expect = chai.expect;
const request = supertest(app);


describe('API Tests', () => {
  let userId = 54;

  // Prueba para agregar un producto
  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'securePassword',
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'Example City',
      phoneNumber: '123-456-7890',
    };
    await syncDatabase();
    const response = await request.post('/api/users/create').send(userData);
    expect(response.status).to.equal(201);
    expect(response.body.info).to.have.property('id');
    userId = response.body.info.id;

  });

  // Prueba para obtener todos los usuarios
  it('should get all users', async () => {
    const response = await request.get('/api/users/all');
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
  });

  it('should login and check the cookie', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'securePassword',
    };

    const response = await request
      .post('/api/users/login')
      .send(loginData);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
  })

  // Prueba para obtener un usuario por su ID
  it('should get a user by ID', async () => {
    const response = await request.get(`/api/users/getuser/${userId}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('id');
    expect(response.body.id).to.equal(userId);
  });

  // Prueba para actualizar un usuario por su ID
  it('should update a user by ID', async () => {
    const updatedUserData = {
      firstName: 'UpdatedFirstName',
    };

    const response = await request
      .put(`/api/users/updateuser/${userId}`)
      .send(updatedUserData);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('id');
    expect(response.body.id).to.equal(userId);
  });


  // Prueba para borrar un usuario por su ID
  it('should delete a user by ID', async () => {
    const response = await request
      .delete(`/api/users/deleteuser/${userId}`)
    try {
      expect(response.status).to.equal(204);
      // expect(response.body).to.have.property('imageName');
    }catch (error) {
      console.error('Error in test:', error);
      console.log('Response body:', response.body);
      throw error; // Re-throw the error to fail the test
    }
  });




  
});
