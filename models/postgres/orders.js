import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
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
    defaultValue: () => Math.floor(Math.random() * 9000000000) + 1000000000
  },
  products:{
    type: DataTypes.JSONB,
    allowNull: false,
  },
  shippingAddress: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
});

export class OrderModel {

  createNewOrder = async (orderInfo) => {
    try {
      const newOrder = await Order.create({...orderInfo});
      return newOrder;
    } catch (error) {
      console.log(error);
    }
  }

  getOrderById = async (orderId) => {
    try {
      const order = await Order.findOne({
        where: { orderId: orderId }    
      });
      return order;
    } catch (error) {
      console.log(error);
    }
  }

  getAllOrders = async (userId) => {
    try {
      const allOrders = await Order.findAll({
        where: { userId: userId }
      });
      const orders = allOrders.map(order => {
        return order.dataValues
      })
      return orders
    } catch (error) {
      console.log(error);
    }
  }
}
