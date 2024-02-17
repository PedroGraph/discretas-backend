import { createProductRouter } from '../routes/products.js';
import { creatingUserRouter } from './users.js';
export const mainRoutes = (app, {productModel, userModel}) => {
    app.use('/api/products', createProductRouter({ productModel }));
    app.use('/api/users',  creatingUserRouter({ userModel }));
}