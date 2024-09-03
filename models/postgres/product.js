import { DataTypes } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../../config/database.js';
import { Image } from './image.js';
import { Op, fn, col, where } from 'sequelize';

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
    defaultValue: 0,
  },
  productPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  characteristics: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

Product.hasMany(Image, { foreignKey: 'productID', sourceKey: 'id' });
Image.belongsTo(Product, { foreignKey: 'productID', targetKey: 'id' });

Product.beforeCreate((product) => {
  if (product.characteristics) {
    const totalQuantity = product.characteristics.reduce((total, characteristic) => {
      return total + parseInt(characteristic.quantity, 10);
    }, 0);
    product.productQuantity = totalQuantity;
  }
});

Product.beforeUpdate((product) => {
  if (product.characteristics) {
    const totalQuantity = product.characteristics.reduce((total, characteristic) => {
      return total + parseInt(characteristic.quantity, 10);
    }, 0);
    product.productQuantity = totalQuantity;
  }
});

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
        product: newProduct,
        image: newImages,
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

      const products = allProducts.map((product) => {
        return {
          ...product.dataValues,
        }
      });
      return transformProducts(products);
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
      const dataValues = product.dataValues;
      return transformProducts([dataValues])[0];
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

  getProductsWithFilters = async (filters) => {
    try {
      const{ orderBy, ...restFilters} = filters;
      if(restFilters.productPrice) restFilters.productPrice = { [Op.between]: restFilters.productPrice.split(",") };
      if(restFilters.productName)  restFilters.productName = where(fn('LOWER', col('productName')),{ [Op.like]: `%${restFilters.productName.toLowerCase()}%` });
      const options = {
        ...(restFilters ? { where: restFilters } : {}),
        ...(orderBy ? { order: [orderBy.split("-")] } : {}),
      }
      const products = await Product.findAll({ ...options, include: [{ model: Image }] });
      const formattedProducts = products.map((product) => {
        return {
          ...product.dataValues,
        }
      });
      return transformProducts(formattedProducts);
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

const transformProducts = (products) => products.map(({ createdAt, updatedAt, ...rest }) =>
  Object.fromEntries(Object.entries(rest).map(([key, value]) => [
    key.startsWith('product') ? key.replace(/^product/, '').replace(/^\w/, c => c.toLowerCase()) : key,
    value
  ]))
);

