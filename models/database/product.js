import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';

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


export const Product = sequelize.define('products', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  productName: {
    type: DataTypes.STRING,
    allowNull: false,
    len: [3, 255],
  },
  productDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
    len: [3, 2000],
  },
  productPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productCategory: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
});

Product.hasMany(Image, { foreignKey: 'productID', sourceKey: 'id' });
Image.belongsTo(Product, { foreignKey: 'productID', targetKey: 'id' });

