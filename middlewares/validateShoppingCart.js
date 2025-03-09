import { shoppingCartSchema, shoppingCartUpdateSchema } from '../validators/shoppingCartValidator.js';
import logger from '../logCreator/log.js';

export const validateCreateCartItem = async (req, res, next) => {
  try {
    await shoppingCartSchema.validateAsync(req.body.shoppingCartData, { abortEarly: false });
    next();
  } catch (error) {
    logger.error('Validation error on shopping cart item creation:', error.details);
    res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        message: detail.message,
        path: detail.path
      }))
    });
  }
};

export const validateUpdateCartItem = async (req, res, next) => {
  try {
    await shoppingCartUpdateSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    logger.error('Validation error on shopping cart item update:', error.details);
    res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        message: detail.message,
        path: detail.path
      }))
    });
  }
};