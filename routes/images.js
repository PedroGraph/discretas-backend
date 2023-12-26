import express from 'express';
import { createImage, getImagesByProductId, deleteImage, updateImage } from '../controllers/Products/images.js';

const router = express.Router();

router.post('/addImage', createImage);
router.post('/:id', getImagesByProductId);
router.delete('/:id', deleteImage);
router.put('/updateImage', updateImage);

export default router;
