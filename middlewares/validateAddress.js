import { addressSchema, addressUpdateSchema } from '../validators/addressValidator.js';
import logger from '../logCreator/log.js';

export const validateCreateAddress = async (req, res, next) => {
  try {
    await addressSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    logger.error('Validation error on address creation:', error.details);
    res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        message: detail.message,
        path: detail.path
      }))
    });
  }
};

export const validateUpdateAddress = async (req, res, next) => {
  try {
    await addressUpdateSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    logger.error('Validation error on address update:', error.details);
    res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        message: detail.message,
        path: detail.path
      }))
    });
  }
};