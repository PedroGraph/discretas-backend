import chai from 'chai';
import supertest from 'supertest';
import app from '../app.js';
import fs from 'fs';
import { Product, Image } from '../models/database/product.js';

const expect = chai.expect;
const request = supertest(app);

describe('API Tests', () => {
  let productId;

  // Prueba para agregar un producto
  it('should add a new product', async () => {
    const productData = {
      productName: 'Nuevo Producto',
      productDescription: 'Descripción del nuevo producto',
      productPrice: 100,
      productCategory: 'Electrónicos',
      productQuantity: 50,
    };

    const response = await request.post('/products/create').send(productData);
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('id');
    productId = response.body.id; // Almacena el ID del producto creado para usarlo en la siguiente prueba
  });

  // Prueba para crear una imagen asociada al producto
  it('should create a new image for the product', async () => {
    const imageFile = {
      buffer: fs.readFileSync('./test/fixtures/overview.jpeg'), // Reemplaza con el contenido real de la imagen
      originalname: 'producto1.jpeg',
    };

    const imageCreationData = {
      productName: 'Nuevo Producto',
      productId: productId,
    };

    const response = await request.post('/images/addImage')
    .field(imageCreationData)
    .attach('image', imageFile.buffer, { filename: imageFile.originalname });
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property('imageName');
    expect(response.body).to.have.property('imagePath');
    expect(response.body).to.have.property('productID', productId);
  });

  // Después de todas las pruebas, limpia la base de datos
  after(async () => {
    await Product.destroy({ where: { id: productId } });
    await Image.destroy({ where: { productID: productId } });
  });
});
