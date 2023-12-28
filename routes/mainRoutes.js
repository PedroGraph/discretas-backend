import products from './products.js';
import images from './images.js';
import users from './users.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const mainRoutes = (app) => {
    app.use('/api/products', products);
    app.use('/api/images', upload.single('image'), images);
    app.use('/api/users', users);
}