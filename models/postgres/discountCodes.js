import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import { UsedDiscountCode } from './usedDiscountCodes.js';

export const DiscountCode = sequelize.define('discountCode', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: () => uuidv4(),
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  discountPercentage: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  expirationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

DiscountCode.hasMany(UsedDiscountCode, { foreignKey: 'discountCodeId', sourceKey: 'id' });
UsedDiscountCode.belongsTo(DiscountCode, { foreignKey: 'discountCodeId', targetKey: 'id' });

export class DiscountCodeModel {
  createDiscountCode = async (discountCodeInfo) => {
    try {
      const newDiscountCode = await DiscountCode.create({...discountCodeInfo});
      return newDiscountCode;
    } catch (error) {
      console.log(error);
    }
  }

  getDiscountCode = async (code) => {
    try {
      const discountCode = await DiscountCode.findOne({
        where: { code: code }    
      });
      return discountCode;
    } catch (error) {
      console.log(error);
    }
  }
}