
import multer from 'multer';
import { createProductRouter } from '../routes/products.js';
import { creatingUserRouter } from './users.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const mainRoutes = (app, {productModel, userModel, imageModel}) => {
    app.use('/api/products',  upload.single('image'), createProductRouter({ productModel }));
    app.use('/api/users',  creatingUserRouter({ userModel }));
}