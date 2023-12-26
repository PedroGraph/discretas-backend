import express from 'express';
import authMiddleware from '../controllers/Middleware/middleware.js';
import { createProduct, getAllProducts, getProductById, deleteProduct, updateProduct } from '../controllers/Products/products.js';

const router = express.Router();

router.post('/create', createProduct);
router.get('/all', getAllProducts);
router.post('/:id', getProductById);
router.delete('/:id', authMiddleware, deleteProduct);
router.put('/updateProduct', updateProduct);

export default router;
