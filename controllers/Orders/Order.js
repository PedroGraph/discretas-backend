import logger from '../../logCreator/log.js';
import { sendReceiptEmail } from '../../utils/nodemails.js';

export class OrderController {
  constructor( orderModel, productModel, userModel, paymentModel ) {
    this.orderModel = orderModel;
    this.productModel = productModel;
    this.userModel = userModel;
    this.paymentModel = paymentModel;
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
      const orders = await this.orderModel.getOrderById(orderId);
  
      if (!orders || orders.length === 0) {
        logger.warn(`Order ${orderId} not found`);
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // Crear objeto para almacenar la orden formateada
      const formattedOrder = {
        orderId: orders[0].orderId,
        shippingAddress: orders[0].shippingAddress,
        createdAt: orders[0].createdAt,
        products: [],
        paymentId: orders[0].paymentId,
      };
  
      // Obtener información de productos
      await Promise.all(
        orders.map(async (order) => {
          const { productId, quantity, size, color } = order;
  
          // Obtener información detallada del producto
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
  
          formattedOrder.products.push(product);
        })
      );
  
      logger.info(`Order ${orderId} obtained successfully with product details`);
      return res.status(200).json(formattedOrder);
    } catch (error) {
      logger.error(`Error obtaining order - Server error. Error message: ${error}`);
      res.status(500).json({ 
        error: `Error server: the items could not be obtained. Error message: ${error}` 
      });
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

  generateOrderReceipt = async (req, res) => {
    try {
      const { orderId } = req.params;
      const orderProducts = await this.orderModel.getOrderById(orderId);

      if (!orderProducts || orderProducts.length === 0) {
        logger.warn(`Order ${orderId} not found`);
        return res.status(404).json({ error: 'Order not found' });
      }

      let totalPrice = 0;
      let totalDiscount = 0;

      const products = await Promise.all(
        orderProducts.map(async (orderProduct) => {
          const { productId, quantity, size, color, discount } = orderProduct;
          const productInfo = await this.productModel.getProductById(productId);

          const product = {
            name: productInfo.name,
            price: productInfo.price,
            quantity,
            size,
            color,
            discount,
          };

          totalPrice += product.price * quantity;
          if (discount > 0) {
            totalDiscount += (product.price * quantity) * (discount / 100);
          }

          return product;
        })
      );

      const discount = totalPrice * orderProducts[0].discount;
      const userInfo = await this.userModel.getUserById({id: orderProducts[0].userId});
      const paymentInfo = await this.paymentModel.getPaymentById(orderProducts[0].paymentId);

      const response = {
        orderId,
        products,
        orderDate: new Date(orderProducts[0].createdAt).toLocaleString(),
        orderStreet: orderProducts[0].shippingAddress.address,
        orderCity: orderProducts[0].shippingAddress.city,
        orderState: orderProducts[0].shippingAddress.state,
        orderName: userInfo.firstName + " " + userInfo.lastName,
        orderEmail: userInfo.email,
        orderPhone: userInfo.phoneNumber,
        orderNumbersCard: paymentInfo.cardLastFourDigits,
        orderNumbersCardHolder: paymentInfo.cardholderName,
        totalDiscount: discount > 0 ? discount : discount,
        subTotal: totalPrice,
        total: totalPrice,
        TrackingURL: `http://localhost:4000/ordernes/${orderId}`,
      };

      const receipt = await sendReceiptEmail(response);

      logger.info(`Order ${orderId} receipt generated successfully`);
      return res.download(receipt, `receipt-${orderId}.pdf`, (err) => {
        if (err) logger.error(`Error downloading receipt - Server error. Error message: ${err}`);
      });
    } catch (error) {
      logger.error(`Error generating order receipt - Server error. Error message: ${error}`);
      res.status(500).json({
        error: `Error server: the receipt could not be generated. Error message: ${error}`,
      });
    }
  };
}
