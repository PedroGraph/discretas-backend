import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const Payment = sequelize.define('payment', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Asegura que no se repitan los paymentId
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  statusDetail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  transactionAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  netAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentMethodId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  payerEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  payerId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  collectorId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  externalReference: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  // Campos de la tarjeta de crédito
  cardFirstSixDigits: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cardLastFourDigits: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cardExpirationMonth: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  cardExpirationYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  cardholderName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cardholderIdentificationNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cardholderIdentificationType: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

export class PaymentModel {

  // Método para crear un nuevo pago
  createNewPayment = async (paymentInfo) => {
    try {
      const newPayment = await Payment.create({...paymentInfo});
      return newPayment;
    } catch (error) {
      console.log(error);
    }
  }

  // Método para obtener un pago por su ID
  getPaymentById = async (paymentId) => {
    try {
      console.log(paymentId);
      const payment = await Payment.findByPk(paymentId);
      return payment;
    } catch (error) {
      console.log(error);
    }
  }

  // Método para obtener pagos por correo electrónico del pagador
  getPaymentsByPayerEmail = async (email) => {
    try {
      const payments = await Payment.findAll({
        where: { payerEmail: email },
        order: [['dateCreated', 'DESC']],
      });
      return payments.map(payment => payment.dataValues);
    } catch (error) {
      console.log(error);
    }
  }
}
