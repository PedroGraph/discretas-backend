
import multer from 'multer';
import { createProductRouter } from '../routes/products.js';
import { creatingUserRouter } from './users.js';
import { createImageRouter } from './images.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const mainRoutes = (app, {productModel, userModel, imageModel}) => {
    app.use('/api/products', createProductRouter({ productModel }));
    app.use('/api/images', upload.single('image'), createImageRouter({ imageModel })); 
    app.use('/api/users',  creatingUserRouter({ userModel }));
}