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
      const sizesTotal = characteristic.sizes?.reduce((sizeTotal, size) => {
        return sizeTotal + (parseInt(size.quantity, 10) || 0);
      }, 0) || 0;
      return total + sizesTotal;
    }, 0);
    product.productQuantity = totalQuantity;
  }
});

Product.beforeUpdate((product) => {
  if (product.characteristics) {
    const totalQuantity = product.characteristics.reduce((total, characteristic) => {
      const sizesTotal = characteristic.sizes?.reduce((sizeTotal, size) => {
        return sizeTotal + (parseInt(size.quantity, 10) || 0);
      }, 0) || 0;
      return total + sizesTotal;
    }, 0);
    product.productQuantity = totalQuantity;
  }
});

export class ProductModel {
  createProduct = async (productData) => {
    try {
      const {productImages, ...productDataWithoutImages} = productData;
      const newProduct = await Product.create(productDataWithoutImages);
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
      console.log(error);
    }
  }

  getAllProducts = async (query = {}) => {
    try {
        const { page = 1, limit = 10 } = query;
        const offset = page > 1 ? (page - 1) * limit : 0;

        const { count, rows: allProducts } = await Product.findAndCountAll({
          include: [{ model: Image }],
          limit: parseInt(limit, 10),
          offset: parseInt(offset, 10),
        });

        const products = allProducts.map((product) => ({
            ...product.dataValues,
        }));

        return {
          products: transformProducts(products),
          page: parseInt(page, 10),
          totalPages: Math.ceil(count / limit)
        };

    } catch (error) {
        console.log(error);
    }
  }

  getProductById = async (productId) => {
    try {
      const product = await Product.findByPk(productId, {
        include: [{ model: Image }],
      });
      if(!product) return null;
      const dataValues = product.dataValues;
      return transformProducts([dataValues])[0];
    } catch (error) {
      console.log(error);
    }
  }
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
        include: [{ model: Image }],
        limit: parseInt(limit || 10, 10),
        offset: parseInt((page || 1) - 1, 10) * parseInt(limit || 10, 10) || 0,
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

