import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import { Product } from './product.js';
import { Image } from './image.js'; // Asegúrate de importar el modelo Image
import { v4 as uuidv4 } from 'uuid';

export const ShoppingCart = sequelize.define('shoppingCart', {
    id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    size: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    discount: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
});

ShoppingCart.belongsTo(Product, { foreignKey: 'productId', targetKey: 'id' });
Product.hasMany(ShoppingCart, { foreignKey: 'productId', sourceKey: 'id' });

// Asegúrate de que Product esté relacionado con Image
Product.hasMany(Image, { foreignKey: 'productID', sourceKey: 'id' });
Image.belongsTo(Product, { foreignKey: 'productID', targetKey: 'id' });

export class ShoppingCartModel {
    async addProductToShoppingCart(cartData) {
        try {
            const existingItem = await ShoppingCart.findOne({
                where: {
                    userId: cartData.userId,
                    productId: cartData.productId,
                    size: cartData.size,
                    color: cartData.color,
                },
            });

            if (existingItem) {
                existingItem.quantity += cartData.quantity;
                await existingItem.save();
                return existingItem;
            } else {
                const newItem = await ShoppingCart.create(cartData);
                return newItem;
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    }

    async getProductsFromShoppingCart(userId) {
        try {
            const cartItems = await ShoppingCart.findAll({
                where: { userId },
                include: [{
                    model: Product,
                    include: [Image], // Incluye el modelo Image aquí
                }],
            });
            return cartItems;
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    }

    async updateProductQuantityInShoppingCart(cartItemId, updatedData) {
        try {
            const [rowsUpdated, [updatedItem]] = await ShoppingCart.update(updatedData, {
                where: { id: cartItemId },
                returning: true,
            });
            if (rowsUpdated > 0) {
                return updatedItem;
            } else {
                console.log('No se pudo actualizar el artículo del carrito.');
                return null;
            }
        } catch (error) {
            console.error('Error updating cart item:', error);
        }
    }

    async deleteProductFromShoppingCart(cartItemId) {
        try {
            const rowsDeleted = await ShoppingCart.destroy({
                where: { id: cartItemId },
            });
            if (rowsDeleted > 0) {
                return { message: 'Artículo eliminado del carrito exitosamente.' };
            } else {
                console.log('No se pudo eliminar el artículo del carrito.');
                return null;
            }
        } catch (error) {
            console.error('Error removing cart item:', error);
        }
    }

    async deleteShoppingCart(cartItemId) {
        try {
            const rowsDeleted = await ShoppingCart.destroy({
                where: { userId: cartItemId },
            });
            if (rowsDeleted > 0) {
                return { message: 'Carrito eliminado exitosamente.' };
            } else {
                console.log('No se pudo eliminar el carrito.');
                return null;
            }
        } catch (error) {
            console.error('Error removing cart item:', error);
        }
    }
}