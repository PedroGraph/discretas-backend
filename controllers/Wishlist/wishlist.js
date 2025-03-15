import logger from "../../logCreator/log.js";

export class WishlistController {
    constructor(wishlistModel, productModel) {
        this.wishlistModel = wishlistModel;
        this.productModel = productModel;
    }

    addWishlistToUser = async (req, res) => {
        const { userId } = req.params;
        const wishlistData = req.body;
        try {
            const newWishlist = await this.wishlistModel.addWishlistToUser({...wishlistData, userId});
            logger.info('A new wishlist has been created');
            return res.status(201).json({ info: newWishlist });
        } catch (error) {
            logger.error('Error adding wishlist to user:', error);
            return res.status(500).json({ error: `Server error: the wishlist could not be added. Error message: ${error}` });
        }
    }

    getWishlistsByUserId = async (req, res) => {
        const { userId } = req.params;
        if(!userId) return res.status(400).json({ error: 'User id is required' });
        try {
            const wishlists = await this.wishlistModel.getWishlistsByUserId(userId);
            if (!wishlists) {
                logger.warn(`Wishlists not found for user ${userId}`);
                return res.status(404).json({ error: 'Wishlists not found' });
            }
            if(!req.query.allinfo) return res.status(200).json(wishlists);
            const formattedWishlists = await Promise.all(
                wishlists.map(async (wishlist) => {
                    const wishlistProducts = await this.productModel.getProductById(wishlist.productId);
                    return {
                        ...wishlist.dataValues,
                        products: wishlistProducts,
                    };
                })
            )
            logger.info(`Wishlists found for user ${userId}`);
            return res.status(200).json(formattedWishlists);
        } catch (error) {
            logger.error(`Error obtaining wishlists - Server error. Error message: ${error}`);
            res.status(500).json({
                error: `Error server: the items could not be obtained. Error message: ${error}`,
            });
        }
    }

    deleteWishlistById = async (req, res) => {
        const { wishlistId } = req.params;
        const { userId } = req.query;
        try {
            const deletedWishlist = await this.wishlistModel.deleteWishlistById(wishlistId, userId);
            if (deletedWishlist) {
                logger.info(`Wishlist deleted successfully`);
                return res.status(204).json({ message: 'Wishlist deleted successfully' });
            }
            logger.warn(`Wishlist not deleted`);
            return res.status(404).json({ error: 'Wishlist not found' });
        } catch (error) {
            logger.error(`Error deleting wishlist - Server error. Error message: ${error}`);
            res.status(500).json({ error: `Error server: the wishlist could not be deleted. Error message: ${error}` });
        }
    }

}