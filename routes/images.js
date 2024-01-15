


import { Router } from 'express';
import authMiddleware from '../controllers/Middleware/middleware.js';
import { ImageController } from '../controllers/Products/images.js';

export const createImageRouter = ({ imageModel }) => {

    const imageRouter = Router();
    const imageController = new ImageController(imageModel);
    const {create, getAll, getById, update, deleteImage} = imageController;

    imageRouter.post('/create', create);
    imageRouter.get('/all', getAll);
    imageRouter.get('/:id', getById);
    imageRouter.put('/update/:id', update);
    imageRouter.delete('/delete/:id', authMiddleware, deleteImage);

    return imageRouter;

}
