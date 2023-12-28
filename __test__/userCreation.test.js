import request from 'supertest';
import { expect } from 'chai';
import app from '../app.js';
import { generateToken } from '../controllers/Middleware/userMiddleware.js';

describe('User Routes Tests', () => {
  let authToken;
  let createdUserId; // Variable para almacenar el ID del usuario creado

  before(async () => {
    const testUser = { id: 1, isAdmin: false };
    authToken = generateToken(testUser);
  });

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

    const response = await request(app)
      .post('/api/users/create')
      .send(userData)
      .expect(201);

    const createdUser = response.body.userInfo;
    authToken = response.body.token;
    createdUserId = createdUser.id; // Almacena el ID del usuario creado
    expect(createdUser.email).to.equal(userData.email);
    expect(createdUser.firstName).to.equal(userData.firstName);
    // Agrega más aserciones según sea necesario
  });

  it('should get all users', async () => {
    await request(app)
      .get('/api/users/all')
      .set('Authorization', `${authToken}`)
      .expect(200);
  });

  it('should get a user by ID', async () => {
    expect(createdUserId).to.exist; // Verifica que se haya creado un usuario
    await request(app)
      .get(`/api/users/getuser/${createdUserId}`)
      .set('Authorization', `${authToken}`)
      .expect(200);
  });

  it('should update a user by ID', async () => {
    expect(createdUserId).to.exist; // Verifica que se haya creado un usuario
    const updatedUserData = {
      firstName: 'UpdatedFirstName',
    };

    await request(app)
      .put(`/api/users/updateuser/${createdUserId}`)
      .set('Authorization', `${authToken}`)
      .send(updatedUserData)
      .expect(200);
  });

  it('should update a user by ID', async () => {
    // ... (código para actualizar un usuario por ID)
  });

  it('should login and check the cookie', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'securePassword',
    };

    const response = await request(app)
      .post('/api/users/login')
      .send(loginData)
      .expect(200);

    authToken = response.body.token;

    // Verificar la cookie en la respuesta
    const cookies = response.headers['set-cookie'];
    expect(cookies).to.exist;
    const sessionIdCookie = cookies.find((cookie) => cookie.startsWith('sessionId='));
    expect(sessionIdCookie).to.exist;

    // Agregar más aserciones según sea necesario
  });

  it('should to allow logout a user', async () => {
    expect(createdUserId).to.exist; // Verifica que se haya creado un usuario
    const response = await request(app)
      .post(`/api/users/logout`)
      .expect(200);
    expect(response.body.message).to.equal('Logout exitoso');
  });

  it('should delete a user by ID', async () => {
    expect(createdUserId).to.exist; // Verifica que se haya creado un usuario
    await request(app)
      .delete(`/api/users/deleteuser/${createdUserId}`)
      .set('Authorization', `${authToken}`)
      .expect(200);
  });


});
