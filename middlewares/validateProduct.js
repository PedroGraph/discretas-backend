import { productSchema, productUpdateSchema } from '../validators/productValidator.js';
import logger from '../logCreator/log.js';

export const validateCreateProduct = async (req, res, next) => {
  try {
    await productSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    logger.error('Validation error on product creation:', error.details);
    res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        message: detail.message,
        path: detail.path
      }))
    });
  }
};

export const validateUpdateProduct = async (req, res, next) => {
  try {
    await productUpdateSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    logger.error('Validation error on product update:', error.details);
    res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        message: detail.message,
        path: detail.path
      }))
    });
  }
};