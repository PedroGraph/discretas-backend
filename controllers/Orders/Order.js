import logger from '../../logCreator/log.js';

export class OrderController {
  constructor( orderModel ) {
    this.orderModel = orderModel;
  }

  createNewOrder = async (req, res) => {
    try {
      const { body } = req;
      const newOrder = await this.orderModel.createNewOrder(body);
      logger.info(`A new order has been created from user ${body.userId}`);
      return res.status(201).json({ info: newOrder });
    } catch (error) {
      logger.error('Has ocurred an error adding a new order');
      console.log(error)
      res.status(500).json({ error: `Error server: the order could not be added. Error message: ${error}` });
    }
  }

  getOrderById = async (req, res) => {
    try {
      const { orderId } = req.params;
      const order = await this.orderModel.getOrderById(orderId);
      if(!order) {
        logger.warn(`Order ${orderId} not found`);
        return res.status(404).json({ error: 'Order not found' });
      }
      logger.info(`Order ${orderId} obtained successfully`);
      return res.status(200).json(order);
    } catch (error) {
      logger.error('Error obtaining items - Server error');
      res.status(500).json({ error: `Error server: the items could not be obtained. Error message: ${error}` });
    }
  }

  getAllOrders = async (req, res) => {
    try {
      const { userId } = req.params;
      const getAllOrders = await this.orderModel.getAllOrders(userId);
      if (getAllOrders.length === 0) {
        logger.warn(`Orders by ${userId} were not found`);
        return res.status(404).json({ error: 'Orders not found' });
      }
      logger.warn(`Orders by ${userId} has been found`);
      return res.status(201).json(getAllOrders);
    } catch (error) {
      logger.error(`Error obtaining items - Server error. Error message: ${error}`);
      res.status(500).json({ error: `Error server: the items could not be obtained. Error message: ${error}` });
    }
  }

}
