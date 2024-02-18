import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../../config/database.js';
import { Image } from './image.js';

export const Product = sequelize.define('products', {
  id: {
    type: DataTypes.UUID,
    defaultValue: () => uuidv4(),
    primaryKey: true,
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
  // Crear un nuevo producto con una imagen
  createProduct = async (productData) => {
    try {
      const {productImages, ...productDataWithoutImages} = productData;
      const newProduct = await Product.create(productDataWithoutImages);
      // Asocia la imagen al producto
      const promises = productImages.map(async (image) => {
        const newImages = await Image.create({
          imageName: image,
          productID: newProduct.dataValues.id,
        });
        return newImages;
      })

      const newImages = await Promise.all(promises);

      return {
       ...newProduc,
       productImages: newImages
      };
    } catch (error) {
      console.log(error,);
    }
  }

  // Obtener todos los productos con sus imágenes
  getAllProducts = async () => {
    try {
      const allProducts = await Product.findAll({
        include: [{ model: Image }],
      });

      return allProducts;
    } catch (error) {
      console.log(error);
    }
  }

  // Obtener un producto por su ID con su imagen
  getProductById = async (productId) => {
    try {
      const product = await Product.findByPk(productId, {
        include: [{ model: Image }],
      });

      return product;
    } catch (error) {
      console.log(error);
    }
  }

  // Actualizar un producto por su ID
  updateProductById = async ({productId, updatedData}) => {
    try {

      const [rowsUpdated, [updatedProduct]] = await Product.update(updatedData, {
        where: { id: productId },
        returning: true,
      });

      if (rowsUpdated > 0) {
        return updatedProduct;
      } else {
        console.log('No se pudo actualizar el producto.');
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Eliminar un producto por su ID
  deleteProductById = async (productId) => {
    try {
      const deletedProduct = await Product.destroy({
        where: { id: productId },
      });

      if (deletedProduct > 0) {
        return { message: 'Producto eliminado exitosamente.' };
      } else {
        console.log('No se pudo eliminar el producto.');
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

