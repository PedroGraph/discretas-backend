import logger from '../../logCreator/log.js';

export class ShoppingController {
  constructor( shoppingModel ) {
    this.shoppingModel = shoppingModel;
  }

  addProductToShoppingCart = async (req, res) => {
    try {
      let { userId, products } = req.body;
      const newProduct = await this.shoppingModel.addProductToShoppingCart({ userId, products });
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
    const userId = req.params.id;
    const {productId, quantity} = req.body;
    try {
      const updateShoppingCart = await this.shoppingModel.updateProductQuantityInShoppingCart({ userId, productId, quantity });

      if (updateShoppingCart) {
        logger.info(`Shopping cart with id ${productId} has been updated successfully `);
        res.status(200).json({ info: updateShoppingCart });
      }

      logger.warn(`Shopping cart with id ${productId} not found ${productId}`);
      res.status(404).json({ error: ' Shopping cart not found' });

    } catch (error) {
      logger.error(`Error updating shopping cart ${productId} - Server error`);
      // res.status(500).json({ error: `Error server: shopping cart could not be updated. Error message. ${error}` });
    }
  }

  deleteShoppingCart = async (req, res) => {
    const userId = req.params.id;
    const { productId } = req.query;
    try {
      const deleteShoppingCart = await this.shoppingModel.deleteProductFromShoppingCart({ userId, productId });

      if (deleteShoppingCart) {
        logger.info(`Shopping cart with id ${productId} has been deleted`);
        return res.status(204).json({ info: 'Shopping cart deleted' });
      }

      logger.warn(`Shopping cart with id ${productId} not found `);
      return res.status(404).json({ error: 'Shopping cart not found' });

    } catch (error) {
      logger.error(`Error deleting shopping cart ${productId} - Server error`);
      res.status(500).json({ error: `Error server: shopping cart could not be deleted. Error message: ${error}` });
    }
  }
}
