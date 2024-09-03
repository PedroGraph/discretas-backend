import { Router } from 'express';
import authMiddleware from '../controllers/Middleware/middleware.js';
import { ProductController } from '../controllers/Products/products.js';

export const createProductRouter = ({ productModel }, redis) => {

    const productsRouter = Router();
    const productController = new ProductController( productModel, redis );
    const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct, getProductsWithFilters } = productController;

    productsRouter.get('/filters', getProductsWithFilters);
    productsRouter.post('/create', createProduct);
    productsRouter.get('/all', getAllProducts);
    productsRouter.get('/:id', getProductById);
    productsRouter.put('/update/:id', updateProduct);
    productsRouter.delete('/delete/:productId', deleteProduct);

    return productsRouter;

}

