import { notificationSchema, notificationUpdateSchema } from '../validators/notificationValidator.js';
import logger from '../logCreator/log.js';

export const validateCreateNotification = async (req, res, next) => {
  try {
    await notificationSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    logger.error('Validation error on notification creation:', error.details);
    res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        message: detail.message,
        path: detail.path
      }))
    });
  }
};

export const validateUpdateNotification = async (req, res, next) => {
  try {
    await notificationUpdateSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    logger.error('Validation error on notification update:', error.details);
    res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        message: detail.message,
        path: detail.path
      }))
    });
  }
};