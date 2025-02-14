import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import { User } from './user.js'; 
import { Product } from './product.js'; 

export const Wishlist = sequelize.define('wishlist', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
});

Wishlist.belongsTo(User, { foreignKey: 'userId', targetKey: 'id' });
User.hasMany(Wishlist, { foreignKey: 'userId', sourceKey: 'id' });

Wishlist.belongsTo(Product, { foreignKey: 'productId', targetKey: 'id' });
Product.hasMany(Wishlist, { foreignKey: 'productId', sourceKey: 'id' });

export class WishlistModel {
    async addWishlistToUser(wishlistData) {
        try {
            const newWishlist = await Wishlist.create({
                ...wishlistData,
            });
            return newWishlist;
        } catch (error) {
            console.log(error);
        }
    }

    async getWishlistsByUserId(userId) {
        try {
            const wishlists = await Wishlist.findAll({
                where: { userId },
                order: [['createdAt', 'DESC']],
            });
            return wishlists.map(wishlist => wishlist.dataValues);
        } catch (error) {
            console.log(`Error Sever: Has been an error getting the wishlists with userId ${userId}. Error Message: ${error}`);
        }
    }

    async deleteWishlistById(wishlistId, userId) {
        try {
            const deletedWishlist = await Wishlist.destroy({ where: { productId: wishlistId, userId } });
            if (deletedWishlist) return deletedWishlist;
            return null;
        } catch (error) {
            console.log(`Error Sever: Has been an error deleting the wishlist with id ${wishlistId}. Error Message: ${error}`);
        }
    }
}


export default Wishlist;