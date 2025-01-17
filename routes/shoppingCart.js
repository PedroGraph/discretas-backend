import { Router } from 'express';
import authMiddleware from '../controllers/Middleware/middleware.js';
import { ShoppingController } from '../controllers/Shopping/ShoppingCart.js';

export const creatingShoppingCartRouter = ({ shoppingCartModel, productModel }) => {

    const shoppingRouter = Router();
    const shoppingController = new ShoppingController(shoppingCartModel, productModel);
    const { addProductToShoppingCart, getProductsFromShoppingCart, updateProductIntoShoppingCart, deleteProductFromShoppingCart, deleteShoppingCart } = shoppingController;

    shoppingRouter.post('/create', addProductToShoppingCart);
    shoppingRouter.get('/all/:userId', getProductsFromShoppingCart);
    shoppingRouter.put('/update/:id', updateProductIntoShoppingCart);
    shoppingRouter.delete('/delete/product/:id', deleteProductFromShoppingCart);
    shoppingRouter.delete('/delete/cart/:id', deleteShoppingCart);

    return shoppingRouter;

}

