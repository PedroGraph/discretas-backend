import logger from '../../logCreator/log.js';
import { saveImageIntoPath } from '../../utils/images.js';

export class ProductController {
  constructor( productModel ) {
    this.productModel = productModel;
  }

  createProduct = async (req, res) => {
    try {
      let { body, file } = req;
      const productImage = await saveImageIntoPath(body, file);
      const newProduct = await this.productModel.createProduct(body, productImage);
      logger.info('A new product has been created');
      res.status(201).json({ info: newProduct });
    } catch (error) {
      logger.error('Has ocurred an error creating a new product');
      res.status(500).json({ error: `Error server: the product could not be created. Error message: ${error}` });
    }
  }

  getAllProducts = async (req, res) => {
    try {
      const products = await this.productModel.getAllProducts();
      logger.info('Items obtained successfully');
      res.status(200).json(products);
    } catch (error) {
      logger.error('Error obtaining items - Server error');
      res.status(500).json({ error: `Error server: the items could not be obtained. Error message: ${error}` });
    }
  }

  getProductById = async (req, res) => {
    const productId = req.params.id;
    try {
      const product = await this.productModel.getProductById(productId);
      if (product) {
        logger.info(`Product obtained successfully - ${productId}`);
        return res.status(200).json(product);
      }
      logger.warn(`Product not found ${productId}`);
      return res.status(404).json({ error: 'Product not found' });
    } catch (error) {
      logger.error(`Error obtaining product ${productId} - Server error`);
      res.status(500).json({ error: `Error server: the product could not be obtained. Error message: ${error}` });
    }
  }

  updateProduct = async (req, res) => {
    const productId = req.params.id;
    const updatedData = req.body;

    try {
      const updatedProduct = await this.productModel.updateProductById({ updatedData, productId });

      if (updatedProduct) {
        logger.info(`Product with id ${productId} has been updated successfully`);
        res.status(200).json({ info: updatedProduct });
      }

      logger.warn(`Product with id ${productId} not found ${productId}`);
      res.status(404).json({ error: 'Product not found' });

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
        logger.info(`Product with id ${productId} has been deleted`);
        res.status(204).json({ info: 'Product deleted' });
      }

      logger.warn(`Product with id ${productId} not found `);
      res.status(404).json({ error: 'Product not found' });

    } catch (error) {
      logger.error(`Error deleting product ${productId} - Server error`);
      res.status(500).json({ error: `Error server: the product could not be deleted. Error message: ${error}` });
    }
  }
}
