import logger from '../../logCreator/log.js';

export class ProductController {
  constructor(productModel, redisClient) {
    this.productModel = productModel;
    this.redisClient = redisClient;
  }

  createProduct = async (req, res) => {
    try {
      let { body } = req;
      const newProduct = await this.productModel.createProduct(body);
      // Invalidar caché después de crear un nuevo producto
      await this.redisClient.del('allProducts');
      logger.info('A new product has been created');
      res.status(201).json({ info: newProduct });
    } catch (error) {
      logger.error('Has occurred an error creating a new product');
      res.status(500).json({ error: `Error server: the product could not be created. Error message: ${error}` });
    }
  }

  getAllProducts = async (req, res) => {
    try {
      // Verificar caché de Redis primero
      const cachedProducts = await this.redisClient.get('allProducts');
      if (cachedProducts) {
        logger.info('Products retrieved from cache');
        return res.status(200).json(JSON.parse(cachedProducts));
      }

      // Si no está en caché, obtener de la base de datos
      const products = await this.productModel.getAllProducts();
      logger.info('Items obtained successfully');

      // Guardar en caché para futuras solicitudes
      await this.redisClient.set('allProducts', JSON.stringify(products), 'EX', 3600); // Caché por 1 hora
      res.status(200).json(products);
    } catch (error) {
      logger.error('Error obtaining items - Server error');
      res.status(500).json({ error: `Error server: the items could not be obtained. Error message: ${error}` });
    }
  }

  getProductById = async (req, res) => {
    const productId = req.params.id;
    try {
      // Verificar caché de Redis primero
      const cachedProduct = await this.redisClient.get(`product:${productId}`);
      if (cachedProduct) {
        logger.info(`Product obtained from cache - ${productId}`);
        return res.status(200).json(JSON.parse(cachedProduct));
      }

      // Si no está en caché, obtener de la base de datos
      const product = await this.productModel.getProductById(productId);
      if (product) {
        logger.info(`Product obtained successfully - ${productId}`);
        // Guardar en caché
        await this.redisClient.set(`product:${productId}`, JSON.stringify(product), 'EX', 3600);
        return res.status(200).json(product);
      }
      logger.warn(`Product not found ${productId}`);
      return res.status(404).json({ error: 'Product not found' });
    } catch (error) {
      logger.error(`Error obtaining product ${productId} - Server error`);
      res.status(500).json({ error: `Error server: the product could not be obtained. Error message: ${error}` });
    }
  }

  getProductsWithFilters = async (req, res) => {
    try {
      const { query } = req;
      const products = await this.productModel.getProductsWithFilters(query);
      if (products) {
        console.log(products.length)
        logger.info("Products filtered successfully");
        return res.status(200).json(products);
      }
      logger.warn("Products not found");
      return res.status(404).json({ error: 'Products not found' });
    } catch (error) {
      logger.error(`Error obtaining products - Server error`);
      res.status(500).json({ error: `Error server: the products could not be obtained. Error message: ${error}` });
    }
  }

  updateProduct = async (req, res) => {
    const productId = req.params.id;
    const updatedData = req.body;
    try {
      const updatedProduct = await this.productModel.updateProductById({ updatedData, productId });
      if (updatedProduct) {
        // Invalidar caché después de actualizar un producto
        await this.redisClient.del(`product:${productId}`);
        await this.redisClient.del('allProducts');
        logger.info(`Product with id ${productId} has been updated successfully`);
        res.status(200).json({ info: updatedProduct });
      } else {
        logger.warn(`Product with id ${productId} not found`);
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      logger.error(`Error updating product ${productId} - Server error`);
      res.status(500).json({ error: `Error server: the product could not be updated. Error message. ${error}` });
    }
  }

  deleteProduct = async (req, res) => {
    const productId = parseInt(req.params.productId);
    try {
      const deletedProduct = await this.productModel.deleteProductById(productId);
      if (deletedProduct) {
        // Invalidar caché después de eliminar un producto
        await this.redisClient.del(`product:${productId}`);
        await this.redisClient.del('allProducts');
        logger.info(`Product with id ${productId} has been deleted`);
        res.status(204).json({ info: 'Product deleted' });
      } else {
        logger.warn(`Product with id ${productId} not found`);
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      logger.error(`Error deleting product ${productId} - Server error`);
      res.status(500).json({ error: `Error server: the product could not be deleted. Error message: ${error}` });
    }
  }
}