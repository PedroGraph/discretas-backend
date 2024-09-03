import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export const UsedDiscountCode = sequelize.define('usedDiscountCode', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  couponCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  usedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export class UsedDiscountCodeModel {
  createUsedDiscountCode = async (usedDiscountCodeInfo) => {
    try {
      const newUsedDiscountCode = await UsedDiscountCode.create({...usedDiscountCodeInfo});
      return newUsedDiscountCode;
    } catch (error) {
      // console.log(error);
    }
  }

  getUsedDiscountCodeByCodeAndUser = async (couponCode, userId) => {
  try {
    const usedDiscountCode = await UsedDiscountCode.findOne({
      where: { 
        couponCode: couponCode,
        userId: userId
      }    
    });
    return usedDiscountCode;
  } catch (error) {
    console.log(error);
  }
}
}