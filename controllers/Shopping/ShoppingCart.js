import logger from '../../logCreator/log.js';

export class ShoppingController {
  constructor( shoppingModel, productModel ) {
    this.shoppingModel = shoppingModel;
    this.productModel = productModel;
  }

  addProductToShoppingCart = async (req, res) => {
    try {
      let { shoppingCartData } = req.body;
      const shoppindCart = await this.shoppingModel.addProductToShoppingCart(shoppingCartData);
      const ProductInfo = await this.productModel.getProductById(shoppingCartData.productId);
      const newProduct = {
        shoppingCart: shoppindCart,
        product: ProductInfo,
      }
      logger.info('A new product has been added to the shopping cart');
      res.status(201).json({ info: newProduct });
    } catch (error) {
      logger.error('Has ocurred an error adding a new product');
      console.log(error)
      res.status(500).json({ error: `Error server: the product could not be added. Error message: ${error}` });
    }
  }

  getProductsFromShoppingCart = async (req, res) => {
    try {
      const { userId } = req.params;
      if(!userId || userId === 'undefined') return res.status(400).json({ error: 'Missing userId' });
      const products = await this.shoppingModel.getProductsFromShoppingCart(userId);
      logger.info('Items obtained successfully');
      return res.status(200).json(products);
    } catch (error) {
      logger.error('Error obtaining items - Server error');
      res.status(500).json({ error: `Error server: the items could not be obtained. Error message: ${error}` });
    }
  }

  updateProductIntoShoppingCart = async (req, res) => {
    const shoppingCartId = req.params.id;
    const {quantity} = req.body;
    try {
      const updateShoppingCart = await this.shoppingModel.updateProductQuantityInShoppingCart(shoppingCartId, { quantity });

      if (updateShoppingCart) {
        logger.info(`Shopping cart with id ${shoppingCartId} has been updated successfully `);
        res.status(200).json({ info: updateShoppingCart });
      }

      logger.warn(`Shopping cart with id ${shoppingCartId} not found ${shoppingCartId}`);
      res.status(404).json({ error: ' Shopping cart not found' });

    } catch (error) {
      logger.error(`Error updating shopping cart ${shoppingCartId} - Server error`);
      // res.status(500).json({ error: `Error server: shopping cart could not be updated. Error message. ${error}` });
    }
  }

  deleteProductFromShoppingCart = async (req, res) => {
    const shoppingCartId = req.params.id;
    try {
      const deletedProduct = await this.shoppingModel.deleteProductFromShoppingCart(shoppingCartId);
      if (deletedProduct) {
        logger.info(`Shopping cart with id ${shoppingCartId} has been deleted`);
        return res.status(204).json({ info: 'Shopping cart deleted' });
      }

      logger.warn(`Shopping cart with id ${shoppingCartId} not found `);
      return res.status(404).json({ error: 'Shopping cart not found' });
    } catch (error) {
      logger.error(`Error deleting shopping cart ${shoppingCartId} - Server error`);
      res.status(500).json({ error: `Error server: shopping cart could not be deleted. Error message: ${error}` });
    }
  }

  deleteShoppingCart = async (req, res) => {
    const shoppingCartId = req.params.id;
    try {
      const deletedProduct = await this.shoppingModel.deleteShoppingCart(shoppingCartId);
      if (deletedProduct) {
        logger.info(`Shopping cart with id ${shoppingCartId} has been deleted`);
        return res.status(204).json({ info: 'Shopping cart deleted' });
      }

      logger.warn(`Shopping cart with id ${shoppingCartId} not found `);
      return res.status(404).json({ error: 'Shopping cart not found' });
    } catch (error) {
      logger.error(`Error deleting shopping cart ${shoppingCartId} - Server error`);
      res.status(500).json({ error: `Error server: shopping cart could not be deleted. Error message: ${error}` });
    }
  }
  
}
