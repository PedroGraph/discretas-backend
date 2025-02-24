import { orderSchema } from '../validators/orderValidator.js';
import logger from '../logCreator/log.js';

export const validateCreateOrder = async (req, res, next) => {
  try {
    await orderSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    logger.error('Validation error on order creation:', error.details);
    res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        message: detail.message,
        path: detail.path
      }))
    });
  }
};