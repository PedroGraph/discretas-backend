import { Router } from 'express';
import { OrderController } from '../controllers/Orders/Order.js';
import { validateCreateOrder } from '../middlewares/validateOrder.js';

export const creatingOrders = ({ orderModel, productModel, userModel, paymentModel }) => {

    const orderRouter = Router();
    const orderController = new OrderController(orderModel, productModel, userModel, paymentModel);
    const { getAllOrders, getOrderById, createNewOrder, generateOrderReceipt } = orderController;

    orderRouter.post('/create', validateCreateOrder, createNewOrder);
    orderRouter.get('/all/:userId', getAllOrders);
    orderRouter.get('/:orderId', getOrderById);
    orderRouter.get('/receipt/:orderId', generateOrderReceipt);

    return orderRouter;

}

