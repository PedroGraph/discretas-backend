import { createProductRouter } from '../routes/products.js';
import { creatingUserRouter } from './users.js';
import { creatingShoppingCartRouter } from './shoppingCart.js';
import { creatingOrders } from './orders.js';
import { verifyDiscounts } from './discounts.js';

export const mainRoutes = (app, {productModel, userModel, shoppingCartModel, orderModel, discountCodeModel, usedDiscountCodeModel}, redis) => {
    app.use('/api/products', createProductRouter({ productModel }, redis));
    app.use('/api/users',  creatingUserRouter({ userModel }));
    app.use('/api/shopping',  creatingShoppingCartRouter({ shoppingCartModel }));
    app.use('/api/orders',  creatingOrders({ orderModel }));
    app.use('/api/discounts', verifyDiscounts({ discountCodeModel, usedDiscountCodeModel }));
}