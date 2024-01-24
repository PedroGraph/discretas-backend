import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import { ShoppingCart } from './shoppingCart.js';
import { User } from './user.js';
import { Product } from './product.js';

export const CartItem = sequelize.define('cartItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

ShoppingCart.belongsToMany(Product, { through: CartItem });


User.hasOne(ShoppingCart);
ShoppingCart.belongsTo(User);

