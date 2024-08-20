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
                    products: [], 
                });
            }
    
            const newProducts = products.map(product => ({
                productID: product.productID,
                price: product.price,
                quantity: product.quantity,
                size: product.size,
                color: product.color,
            }));
    
            const updatedProducts = shoppingCart.products.map(cartProduct => {
                const newProduct = newProducts.find(product => product.productID === cartProduct.productID);
                if (newProduct) {
                    return {
                        ...cartProduct,
                        quantity: cartProduct.quantity + newProduct.quantity
                    };
                }
                return cartProduct;
            });
    
            const remainingNewProducts = newProducts.filter(product => !updatedProducts.find(cartProduct => cartProduct.productID === product.productID));
            updatedProducts.push(...remainingNewProducts);
    
            const updatedTotalAmount = this.calculateTotalAmount(updatedProducts);
    
            await shoppingCart.update({ 
                products: updatedProducts,
                totalAmount: updatedTotalAmount 
            });
    
            return shoppingCart;
    
        } catch (error) {
            console.error('Error updating shopping cart:', error);
            throw new Error('Could not update shopping cart');
        }
    }
    

    getProductsFromShoppingCart = async (userId) => {
        try {
            const shoppingCart = await ShoppingCart.findOne({ where: { userId } });

            if (!shoppingCart) {
                console.log('User shopping cart not found');
                return null;
            }

            return shoppingCart.dataValues;
        } catch (error) {
            console.log(error);
        }
    }

    updateProductQuantityInShoppingCart = async ({ userId, productId, quantity }) => {
        try {
            const shoppingCart = await ShoppingCart.findOne({ where: { userId } });
    
            if (!shoppingCart) {
                console.log('Shopping cart not found');
                return null;
            }
    
            const updatedProducts = shoppingCart.products.map(product => {
                if (product.productID === productId) {
                    return {
                        ...product,
                        quantity: quantity
                    };
                }
                return product;
            });
    
            await shoppingCart.update({ products: updatedProducts });
    
            return shoppingCart;
        } catch (error) {
            console.error('Error updating product quantity:', error);
            throw new Error('Could not update product quantity');
        }
    }

    deleteProductFromShoppingCart = async ({ userId, productId }) => {
        try {
            const shoppingCart = await ShoppingCart.findOne({ where: { userId } });
    
            if (!shoppingCart) {
                console.log('User shopping cart not found');
                return null;
            }
    
            const updatedProducts = shoppingCart.dataValues.products.filter(product => product.productID !== productId);
            
            if (updatedProducts.length === 0) {
                await shoppingCart.destroy();
                return null; // No products left in the shopping cart
            }
    
            const updatedTotalAmount = this.calculateTotalAmount(updatedProducts);
    
            await shoppingCart.update({ 
                products: updatedProducts,
                totalAmount: updatedTotalAmount 
            });
    
            return shoppingCart;
        } catch (error) {
            console.error('Error deleting product from shopping cart:', error);
            throw new Error('Could not delete product from shopping cart');
        }
    }
    
    calculateTotalAmount = (products) => {
        return products.reduce((total, product) => {
            return total + (product.price * product.quantity);
        }, 0);
    }
}
