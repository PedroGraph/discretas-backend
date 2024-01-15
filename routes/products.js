import { Router } from 'express';
import authMiddleware from '../controllers/Middleware/middleware.js';
import { ProductController } from '../controllers/Products/products.js';

export const createProductRouter = ({ productModel }) => {

    const productsRouter = Router();
    const productController = new ProductController( productModel );

    productsRouter.post('/create', productController.createProduct);
    productsRouter.get('/all', productController.getAllProducts);
    productsRouter.get('/:id', productController.getProductById);
    productsRouter.put('/update/:id', productController.updateProduct);
    productsRouter.delete('/delete/:productId', productController.deleteProduct);

    return productsRouter;

}

