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
      const products = await this.shoppingModel.getProductsFromShoppingCart(userId);
      logger.info('Items obtained successfully');
      res.status(200).json(products);
    } catch (error) {
      logger.error('Error obtaining items - Server error');
      res.status(500).json({ error: `Error server: the items could not be obtained. Error message: ${error}` });
    }
  }

  updateProductIntoShoppingCart = async (req, res) => {
    const shoppingCartId = req.params.id;
    const updatedData = req.body;

    try {
      const updateShoppingCart = await this.shoppingModel.updateProductIntoShoppingCart({ updatedData, shoppingCartId });

      if (updateShoppingCart) {
        logger.info(`Shopping cart with id ${shoppingCartId} has been updated successfully `);
        res.status(200).json({ info: updateShoppingCart });
      }

      logger.warn(`Shopping cart with id ${shoppingCartId} not found ${shoppingCartId}`);
      res.status(404).json({ error: ' Shopping cart not found' });

    } catch (error) {
      logger.error(`Error updating shopping cart ${shoppingCartId} - Server error`);
      res.status(500).json({ error: `Error server: shopping cart could not be updated. Error message. ${error}` });
    }
  }

  deleteShoppingCart = async (req, res) => {
    const shoppingCartId = parseInt(req.params.shoppingCartId);
    try {
      const deleteShoppingCart = await this.shoppingModel.deleteProductById(shoppingCartId);

      if (deleteShoppingCart) {
        logger.info(`Shopping cart with id ${shoppingCartId} has been deleted`);
        res.status(204).json({ info: 'Shopping cart deleted' });
      }

      logger.warn(`Shopping cart with id ${shoppingCartId} not found `);
      res.status(404).json({ error: 'Shopping cart not found' });

    } catch (error) {
      logger.error(`Error deleting shopping cart ${shoppingCartId} - Server error`);
      res.status(500).json({ error: `Error server: shopping cart could not be deleted. Error message: ${error}` });
    }
  }
}
