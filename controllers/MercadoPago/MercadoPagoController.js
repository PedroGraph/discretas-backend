import logger from '../../logCreator/log.js';

export class MercadoPagoController {
    constructor(mercadoPagoModel, paymentModel) {
        this.mercadoPagoModel = mercadoPagoModel;
        this.paymentModel = paymentModel;
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

    getPaymentInfoById = async (req, res) => {
        try {
            const paymentId = req.params.id;
            const paymentInfo = await this.paymentModel.getPaymentById(paymentId);
            if (paymentInfo) return res.status(200).json(paymentInfo);
            else return res.status(404).json({ message: 'Payment not found' });
            // logger.info('Getting payment by ID:', payment.id);
        } catch (error) {
            logger.error('Error to get payment by ID:', error);
            res.status(500).json({ message: 'Error en el servidor' });
        }
    };
}