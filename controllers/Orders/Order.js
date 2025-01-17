import logger from '../../logCreator/log.js';

export class OrderController {
  constructor( orderModel, productModel ) {
    this.orderModel = orderModel;
    this.productModel = productModel;
  }

  createNewOrder = async (req, res) => {
    try {
      const { body } = req;
      await this.orderModel.createNewOrder(body);
      logger.info(`A new order has been created from user ${body.userId}`);
      return res.status(201).json({ status: true, info: "Order created successfully" });
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
      const { date } = req.query;
      let getAllOrders = await this.orderModel.getAllOrders(userId, date);
  
      if (getAllOrders.length === 0) {
        logger.warn(`Orders by ${userId} were not found`);
        return res.status(404).json({ error: 'Orders not found' });
      }
  
      const ordersMap = {};
  
      await Promise.all(
        getAllOrders.map(async (order) => {
          const { productId, quantity, size, color, shippingAddress, createdAt, orderId } = order;
  
          // Obtén información del producto
          const productInfo = await this.productModel.getProductById(productId);
  
          const product = {
            name: productInfo.name,
            id: productId,
            category: productInfo.category,
            color,
            size,
            price: productInfo.price,
            quantity,
            images: productInfo.images,
          };
  
          // Agrupa productos por orderId
          if (!ordersMap[orderId]) {
            ordersMap[orderId] = {
              orderId,
              shippingAddress,
              createdAt,
              products: [],
            };
          }
  
          ordersMap[orderId].products.push(product);
        })
      );
  
      const formattedOrders = Object.values(ordersMap);
  
      logger.info(`Orders by ${userId} have been found and formatted`);
      return res.status(201).json(formattedOrders);
    } catch (error) {
      logger.error(`Error obtaining items - Server error. Error message: ${error}`);
      res.status(500).json({
        error: `Error server: the items could not be obtained. Error message: ${error}`,
      });
    }
  }
}
