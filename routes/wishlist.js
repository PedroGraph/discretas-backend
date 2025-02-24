import  { Router } from 'express';
import { WishlistController } from '../controllers/Wishlist/wishlist.js';

export const creatingWishlist = ({ wishlistModel, productModel }) => {

    const wishlistRouter = Router();
    const wishlistController = new WishlistController(wishlistModel, productModel);
    const { addWishlistToUser, getWishlistsByUserId, deleteWishlistById } = wishlistController;

    wishlistRouter.post('/:userId', addWishlistToUser);
    wishlistRouter.get('/:userId', getWishlistsByUserId);
    wishlistRouter.delete('/:wishlistId', deleteWishlistById);

    return wishlistRouter;
}