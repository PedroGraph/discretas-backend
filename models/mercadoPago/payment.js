import { MercadoPagoConfig, Payment as MercadoPagoPayment } from 'mercadopago';
import { config } from 'dotenv';
import { PaymentModel } from '../postgres/payment.js';

config();

export class MercadoPagoModel {
  constructor() {
    this.paymentModel = new PaymentModel();
  }

  createPayment = async (body) => {
    const client = new MercadoPagoConfig({
      accessToken: process.env.ACCESS_TOKEN_MERCADO_PAGO,
      options: { timeout: 5000, idempotencyKey: 'unique-key-' + Date.now() },
    });
    const payment = new MercadoPagoPayment(client);

    const response = await payment.create({ body });

    if (response) {
      const paymentData = {
        paymentId: response.id.toString(),
        status: response.status,
        statusDetail: response.status_detail,
        transactionAmount: response.transaction_amount,
        netAmount: response.net_amount,
        paymentMethodId: response.payment_method_id,
        payerEmail: body.payer?.email || null,
        payerId: body.payer?.number || null,
        collectorId: response.collector_id,
        externalReference: response.external_reference || null,
        installments: response.installments || null,

        // Detalles de la tarjeta
        cardLastFourDigits: response.card?.last_four_digits || null,
        cardholderName: response.card?.cardholder?.name || null,
        cardholderIdentificationNumber: response.card?.cardholder?.identification?.number || null,
        cardholderIdentificationType: response.card?.cardholder?.identification?.type || null,
      };

      const newPayment = await this.paymentModel.createNewPayment(paymentData);
      return {
        status: response.status,
        id: newPayment.id,
        payment: true,
        details: newPayment,
      };
    }

    return {
      status: response.status,
      id: response.id,
      payment: false,
    };
  };
}
