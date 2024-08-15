import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import { Product } from './product.js';
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
    products: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: [],
    },
    totalAmount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export class ShoppingCartModel {
    
    addProductToShoppingCart = async ({ userId, products }) => {
        try {

            let shoppingCart = await ShoppingCart.findOne({ where: { userId } });

            if (!shoppingCart) {
                shoppingCart = await ShoppingCart.create({
                    userId, 
                    totalAmount: 0, 
                });
            }

            const newProducts = products.map(product => ({
                productID: product.productID,
                price: product.price,
                quantity: product.quantity,
                size: product.size,
                color: product.color,
            }));

            const updatedProducts = shoppingCart.products.length > 0 ? [...shoppingCart.products, ...newProducts] : newProducts;
            const updatedTotalAmount = this.calculateTotalAmount(updatedProducts);

            console.log(updatedProducts);
            console.log(updatedTotalAmount);

            await shoppingCart.update({ 
                products: updatedProducts,
                totalAmount: updatedTotalAmount 
            });

            return shoppingCart;

        } catch (error) {
            console.log(error);
        }
    }

    getProductsFromShoppingCart = async (userId) => {
        try {
            const shoppingCart = await ShoppingCart.findOne({ where: { userId } });

            if (!shoppingCart) {
                console.log('User shopping cart not found');
                return null;
            }

            return shoppingCart.products;
        } catch (error) {
            console.log(error);
        }
    }

    updateProductIntoShoppingCart = async ({ userId, updatedData }) => {
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

    deleteShoppingCart = async ({ userId, productID }) => {
        try {
            const shoppingCart = await ShoppingCart.findOne({ where: { userId } });

            if (!shoppingCart) {
                console.log('User shopping cart not found');
                return null;
            }

            const updatedProducts = shoppingCart.products.filter(product => product.productID !== productID);
            const updatedTotalAmount = this.calculateTotalAmount(updatedProducts);

            await shoppingCart.update({ 
                products: updatedProducts,
                totalAmount: updatedTotalAmount 
            });

            return shoppingCart;
        } catch (error) {
            console.log(error);
        }
    }

    calculateTotalAmount = (products) => {
        return products.reduce((total, product) => {
            return total + (product.price * product.quantity);
        }, 0);
    }
}
