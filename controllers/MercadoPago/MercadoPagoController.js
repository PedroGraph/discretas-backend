import logger from '../../logCreator/log.js';

export class MercadoPagoController {
    constructor(mercadoPagoModel) {
        this.mercadoPagoModel = mercadoPagoModel;
    }

    createPayment = async (req, res) => {
        try {
            const paymentInfo = req.body;
            const newPayment = await this.mercadoPagoModel.createPayment(paymentInfo);
            logger.info('A new payment has been created');
            if (newPayment) res.status(201).json({ info: newPayment });
        } catch (error) {
            logger.error('Error to create payment:', error);
            res.status(500).json({ message: error });
            console.log('Error to create payment:', error);
        }
    };
}