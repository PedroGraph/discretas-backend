import { Router } from 'express';
import authMiddleware from '../controllers/Middleware/middleware.js';
import { MercadoPagoController } from '../controllers/MercadoPago/MercadoPagoController.js';

export const mercadoPagoRoute = ({ MercadoPagoModel }) => {

    const mercadoPagoRouter = Router();
    const mercadoPagoController = new MercadoPagoController(MercadoPagoModel);
    const {createPayment} = mercadoPagoController;
    mercadoPagoRouter.post('/payment_process', createPayment);
    return mercadoPagoRouter;

}

