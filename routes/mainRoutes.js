import { createProductRouter } from '../routes/products.js';
import { creatingUserRouter } from './users.js';
import { creatingShoppingCartRouter } from './shoppingCart.js';
import { creatingOrders } from './orders.js';
import { verifyDiscounts } from './discounts.js';
import { mercadoPagoRoute } from './mercadoPago.js';
import { creatingAddress } from './address.js';
import { creatingWishlist } from './wishlist.js';

export const mainRoutes = (app, models, redis) => {
    const { 
        productModel, 
        userModel, 
        shoppingCartModel, 
        orderModel, 
        discountCodeModel, 
        usedDiscountCodeModel, 
        mercadoPagoModel, 
        paymentModel, 
        addressModel, 
        wishlistModel,
        notificationModel 
    } = models;

    app.use('/api/products', createProductRouter({ productModel }, redis));
    app.use('/api/users', creatingUserRouter({ userModel, notificationModel, addressModel }));
    app.use('/api/shopping', creatingShoppingCartRouter({ shoppingCartModel, productModel }));
    app.use('/api/orders', creatingOrders({ orderModel, productModel }));
    app.use('/api/discounts', verifyDiscounts({ discountCodeModel, usedDiscountCodeModel }));
    app.use('/api/mercadoPago', mercadoPagoRoute({ MercadoPagoModel: mercadoPagoModel, PaymentModel: paymentModel }));
    app.use('/api/addresses', creatingAddress({ addressModel }));
    app.use('/api/wishlists', creatingWishlist({ wishlistModel, productModel }));
}