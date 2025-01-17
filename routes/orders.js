import { Router } from 'express';
import authMiddleware from '../controllers/Middleware/middleware.js';
import { OrderController } from '../controllers/Orders/Order.js';

export const creatingOrders = ({ orderModel, productModel }) => {

    const orderRouter = Router();
    const orderController = new OrderController(orderModel, productModel);
    const { getAllOrders, getOrderById, createNewOrder } = orderController;

    orderRouter.post('/create', createNewOrder);
    orderRouter.get('/all/:userId', getAllOrders);
    orderRouter.get('/:orderId', getOrderById);

    return orderRouter;

}

