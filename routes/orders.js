import { Router } from 'express';
import { OrderController } from '../controllers/Orders/Order.js';
import { validateCreateOrder } from '../middlewares/validateOrder.js';

export const creatingOrders = ({ orderModel, productModel }) => {

    const orderRouter = Router();
    const orderController = new OrderController(orderModel, productModel);
    const { getAllOrders, getOrderById, createNewOrder } = orderController;

    orderRouter.post('/create', validateCreateOrder, createNewOrder);
    orderRouter.get('/all/:userId', getAllOrders);
    orderRouter.get('/:orderId', getOrderById);

    return orderRouter;

}

