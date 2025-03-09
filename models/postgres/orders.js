import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';

export const Order = sequelize.define('order', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  orderId: {
    type: DataTypes.STRING,
    allowNull: false, 
    defaultValue: () => Math.floor(Math.random() * 9000000000) + 1000000000,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  paymentId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  size: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  shippingAddress: {
    type: DataTypes.JSONB, // Guarda como JSON el objeto completo
    allowNull: false,
  },
});

export class OrderModel {

  createNewOrder = async (orderInfo) => {
    const { order, address, city, state, paymentId } = orderInfo;

    try {
      const orderId = Math.floor(Math.random() * 9000000000) + 1000000000;
      const shippingAddress = {
        address,
        city,
        state,
      };

      const newOrders = await Promise.all(
        order.map((product) =>
          Order.create({
            ...product,
            paymentId,
            shippingAddress, 
            orderId, 
          })
        )
      );

      return newOrders;
    } catch (error) {
      console.error('Error al crear órdenes:', error);
      throw error;
    }
  };

  async getOrderById(orderId) {
    try {
      const orders = await Order.findAll({
        where: { orderId },
      });
      return orders.map((order) => order.dataValues);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getAllOrders(userId, limitDate) {
    try {
      const allOrders = await Order.findAll({
        where: {
          userId,
          createdAt: {
            [Op.between]: [new Date(limitDate), new Date()],
          },
        },
        order: [['createdAt', 'DESC']],
      });
      return allOrders.map((order) => order.dataValues);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
