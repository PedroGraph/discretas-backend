import { Router } from 'express';
import { MercadoPagoController } from '../controllers/MercadoPago/MercadoPagoController.js';

export const mercadoPagoRoute = ({ MercadoPagoModel, PaymentModel }) => {

    const mercadoPagoRouter = Router();
    const mercadoPagoController = new MercadoPagoController(MercadoPagoModel, PaymentModel);
    const { createPayment, getPaymentInfoById } = mercadoPagoController;
    mercadoPagoRouter.post('/payment_process', createPayment);
    mercadoPagoRouter.get('/payment_info/:id', getPaymentInfoById);
    return mercadoPagoRouter;

}

