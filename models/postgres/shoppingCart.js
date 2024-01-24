import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import { ShoppingCart } from './shoppingCart.js';
import { CartItem } from './cartItem';
import { Product } from './product.js';

export const ShoppingCart = sequelize.define('shoppingCart', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    totalAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export class ShoppingCartModel {

  addProductToCart = async ({ userId, productId, quantity }) => {
    try {
        
      const shoppingCart = await ShoppingCart.findOne({
        where: { userId },
        include: [{ model: Product, through: CartItem }],
      });

      if (!shoppingCart) {
        console.log('User shopping cart not found');
        return null;
      }

      await CartItem.create({
        quantity,
        productId,
        shoppingCartId: shoppingCart.id,
      });

      const updatedTotalAmount = await calculateTotalAmount(shoppingCart.id);
      await shoppingCart.update({ totalAmount: updatedTotalAmount });

      return shoppingCart;
    } catch (error) {
      console.log(error);
    }
  }


  getAllProductsInCart = async (userId) => {
    try {
    
      const shoppingCart = await ShoppingCart.findOne({
        where: { userId },
        include: [{ model: Product, through: CartItem }],
      });

      if (!shoppingCart) {
        console.log('User shopping cart not found');
        return null;
      }

      
      return shoppingCart.Products;
    } catch (error) {
      console.log(error);
    }
  }

  updateCart = async ({ userId, updatedData }) => {
    try {
     
      const [rowsUpdated, [updatedShoppingCart]] = await ShoppingCart.update(updatedData, {
        where: { userId },
        returning: true,
      });

      if (rowsUpdated > 0) {
        return updatedShoppingCart;
      } else {
        console.log('Shopping cart was not updated');
        return null;
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Eliminar un producto del carrito
  deleteProductFromCart = async ({ userId, productId }) => {
    try {
      const shoppingCart = await ShoppingCart.findOne({
        where: { userId },
        include: [{ model: Product, through: CartItem }],
      });

      if (!shoppingCart) {
        console.log('User shopping cart not found');
        return null;
      }

      await CartItem.destroy({
        where: { shoppingCartId: shoppingCart.id, productId },
      });

      const updatedTotalAmount = await calculateTotalAmount(shoppingCart.id);
      await shoppingCart.update({ totalAmount: updatedTotalAmount });

      return shoppingCart;
    } catch (error) {
      console.log(error);
    }
  }
}

async function calculateTotalAmount(shoppingCartId) {
  // Implementa la lógica para calcular el totalAmount basándote en los productos actuales en el carrito
  // ...
}
