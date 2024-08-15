import { Router } from 'express';
import authMiddleware from '../controllers/Middleware/middleware.js';
import { ShoppingController } from '../controllers/Shopping/ShoppingCart.js';

export const creatingShoppingCartRouter = ({ shoppingCartModel }) => {

    const shoppingRouter = Router();
    const shoppingController = new ShoppingController(shoppingCartModel);
    const { addProductToShoppingCart, getProductsFromShoppingCart, updateProductIntoShoppingCart, deleteShoppingCart } = shoppingController;

    shoppingRouter.post('/create', addProductToShoppingCart);
    shoppingRouter.get('/all/:userId', getProductsFromShoppingCart);
    shoppingRouter.put('/update/:id', updateProductIntoShoppingCart);
    shoppingRouter.delete('/delete/:id', deleteShoppingCart);

    return shoppingRouter;

}

