import { Router } from 'express';
import authMiddleware from '../controllers/Middleware/middleware.js';
import { DiscountsController } from '../controllers/Discounts/discounts.js';

export const verifyDiscounts = ({ usedDiscountCodeModel, discountCodeModel }) => {

    const discountRouter = Router();
    const discountController = new DiscountsController({discountCodeModel, usedDiscountCodeModel});
    const { getUsedDiscountCode, setNewUsedDiscountCode } = discountController;

    discountRouter.get('/verifyCode/:code', getUsedDiscountCode);
    discountRouter.post('/new', setNewUsedDiscountCode);
    return discountRouter;

}

