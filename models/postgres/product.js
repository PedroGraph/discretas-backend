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
    validate: {
      len: [3, 255],
    },
  },
  productDescription: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [3, 2000],
    },
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

export class ProductModel {

  save = async (product) => {
    try{
      const newProduct = await Product.create(product);
      if(newProduct) return newProduct.dataValues;
      else return [];
    }catch(error){
      console.log(error);
    }
  }

  getAll = async () => {
    try{
      const getAllProducts = await Product.findAll({
        include: [{
          model: Image,
          attributes: ['id'],
        }],
      });
      if(getAllProducts) return getAllProducts;
      return [];
    }catch(error){
      console.log(error);
    }
  }

  getById = async (productId) => {
    try{
      const product = await Product.findByPk(productId, { include: Image });
      if(product) return product;
      return [];
    }catch(error){
      console.log(error);
    }
  }

  update = async ({updatedData, productId}) => {
    try{
      const  [rowsUpdated, [updatedProduct]] = await Product.update(updatedData, {
        where: { id: productId },
        returning: true,
      });
      if(rowsUpdated > 0) return updatedProduct;
      else return [];
    }catch(error){
      console.log(error);
    }
  }

  delete = async (productId) => {
    try{
      const product = await Product.destroy({
        where: { id: productId },
      });
      if(product) return product;
      else return [];
    }catch(error){
      // console.log(error);
    }
  }
}

export class ImageModel {
  save = async (image) => {
    try{
      const newImage = await Image.create(image);
      if(newImage) return newImage;
      else return [];
    }catch(error){
      console.log(error);
    }
  }

  getAll = async () => {
    try{
      const allImages = await Image.findAll();
      if(allImages) return allImages;
      return [];
    }catch(error){
      console.log(error);
    }
  }
  
  getById = async (imageId) => {
    try{
      const image = await Image.findByPk(imageId);
      if(image) return image;
      return [];
    }catch(error){
      console.log(error);
    }
  }

  update = async ({updatedData, imageId}) => {
    try{
      const  [rowsUpdated, [updatedImage]] = await Image.update(updatedData, {
        where: { id: imageId },
        returning: true,
      });
      if(rowsUpdated > 0) return updatedImage;
      else return [];
    }catch(error){
      console.log(error);
    }
  }

  delete = async ({imageId}) => {
    try{
      const rowsDeleted = await Image.destroy({
        where: { id: imageId },
      });
      if(rowsDeleted > 0) return {message: "Image deleted successfully"};
      else return [];
    }catch(error){
      console.log(error);
    }
  }
}
