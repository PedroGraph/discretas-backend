import products from './products.js';
import images from './images.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const mainRoutes = (app) => {
    app.use('/products', products);
    app.use('/images', upload.single('image'), images);
}