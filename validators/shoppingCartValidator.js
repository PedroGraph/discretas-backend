import Joi from 'joi';

export const shoppingCartSchema = Joi.object({
  userId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.uuid': 'User ID must be a valid UUID',
      'string.empty': 'User ID cannot be empty',
      'any.required': 'User ID is required'
    }),

  productId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.uuid': 'Product ID must be a valid UUID',
      'string.empty': 'Product ID cannot be empty',
      'any.required': 'Product ID is required'
    }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity must be at least 1',
      'any.required': 'Quantity is required'
    }),

  size: Joi.string()
    .required()
    .messages({
      'string.empty': 'Size cannot be empty',
      'any.required': 'Size is required'
    }),

  color: Joi.string()
    .required()
    .messages({
      'string.empty': 'Color cannot be empty',
      'any.required': 'Color is required'
    }),

  discount: Joi.number()
    .min(0)
    .max(100)
    .default(0)
    .messages({
      'number.base': 'Discount must be a number',
      'number.min': 'Discount cannot be negative',
      'number.max': 'Discount cannot be greater than 100'
    })
});

export const shoppingCartUpdateSchema = Joi.object({
  quantity: Joi.number()
    .integer()
    .min(1)
    .messages({
      'number.base': 'Quantity must be a number',
      'number.integer': 'Quantity must be an integer',
      'number.min': 'Quantity must be at least 1'
    }),

  size: Joi.string()
    .messages({
      'string.empty': 'Size cannot be empty'
    }),

  color: Joi.string()
    .messages({
      'string.empty': 'Color cannot be empty'
    }),

  discount: Joi.number()
    .min(0)
    .max(100)
    .messages({
      'number.base': 'Discount must be a number',
      'number.min': 'Discount cannot be negative',
      'number.max': 'Discount cannot be greater than 100'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});