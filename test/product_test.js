import chai from 'chai';
import supertest from 'supertest';
import app from '../mainServer.js';
import fs from 'fs';

const expect = chai.expect;
const request = supertest(app);

describe('API Tests', () => {
  let productId;

  it('should add a new product', async () => {
    const productData = {
      productName: 'Nuevo Producto',
      productDescription: 'Descripción del nuevo producto',
      productPrice: 100,
      productCategory: 'Electrónicos',
      productQuantity: 50,
    };

    const imageFile = {
      buffer: fs.readFileSync('./test/test files/overview.jpeg'),
      originalname: 'producto1.jpeg',
    };

    const response = await request.post('/api/products/create')
    .field(productData)
    .attach('image', imageFile.buffer, { filename: imageFile.originalname });
    expect(response.status).to.equal(201);
    productId = response.body.info.product.id; 

  });

  it('should get all products', async () => {
    const response = await request.get('/api/products/all');
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
  });

  it('should get a product by ID', async () => {
    const response = await request.get(`/api/products/${productId}`);
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('id');
    expect(response.body.id).to.equal(productId);
  });

  it('should update a product by ID', async () => {
    const updatedProductData = {
      productName: 'Nuevo Nombre del Producto',
    };
    const response = await request
      .put(`/api/products/update/${productId}`)
      .send(updatedProductData);
    expect(response.status).to.equal(200);
    expect(response.body.info).to.have.property('id');
    expect(response.body.info.id).to.equal(productId);
  });

  it('should delete the new product was created', async () => {
    const response = await request
      .delete(`/api/products/delete/${productId}`)
    try {
      expect(response.status).to.equal(204);
      // expect(response.body).to.have.property('imageName');
    }catch (error) {
      console.error('Error in test:', error);
      console.log('Response body:', response.body);
      throw error; 
    }
  });
  
});
