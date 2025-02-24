import { userSchema, userUpdateSchema, userChangePasswordSchema, userLoginSchema } from '../validators/userValidator.js';
import logger from '../logCreator/log.js';

export const validateCreateUser = async (req, res, next) => {
  try {
    await userSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    logger.error('Validation error on user creation:', error.details);
    res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        message: detail.message,
        path: detail.path
      }))
    });
  }
};

export const validateUpdateUser = async (req, res, next) => {
  try {
    await userUpdateSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    logger.error('Validation error on user update:', error.details);
    res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        message: detail.message,
        path: detail.path
      }))
    });
  }
};

export const validateLogin = async (req, res, next) => {
  try {
    await userLoginSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    logger.error('Validation error on user login:', error.details);
    res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        message: detail.message,
        path: detail.path
      }))
    });
  }
};

export const validateChangePassword = async (req, res, next) => {
  try {
    await userChangePasswordSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    logger.error('Validation error on user change password:', error.details);
    res.status(400).json({
      error: 'Validation error',
      details: error.details.map(detail => ({
        message: detail.message,
        path: detail.path
      }))
    });
  }
};