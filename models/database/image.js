import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js'; 
import { Product } from './product.js';

export const Image = sequelize.define('image', {
  id:{
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  imageName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imagePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

