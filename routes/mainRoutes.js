import { createProductRouter } from '../routes/products.js';
import { creatingUserRouter } from './users.js';
import { creatingShoppingCartRouter } from './shoppingCart.js';
import { creatingOrders } from './orders.js';

export const mainRoutes = (app, {productModel, userModel, shoppingCartModel, orderModel}) => {
    app.use('/api/products', createProductRouter({ productModel }));
    app.use('/api/users',  creatingUserRouter({ userModel }));
    app.use('/api/shopping',  creatingShoppingCartRouter({ shoppingCartModel }));
    app.use('/api/orders',  creatingOrders({ orderModel }));
}