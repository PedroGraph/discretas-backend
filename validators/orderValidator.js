import Joi from 'joi';

const orderItemSchema = Joi.object({
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
    .messages({
      'number.base': 'Discount must be a number',
      'number.min': 'Discount cannot be negative',
      'number.max': 'Discount cannot be greater than 100'
    })
});

export const orderSchema = Joi.object({
  order: Joi.array()
    .items(orderItemSchema)
    .min(1)
    .required()
    .messages({
      'array.min': 'Order must contain at least one item',
      'array.base': 'Order must be an array',
      'any.required': 'Order items are required'
    }),

  address: Joi.string()
    .required()
    .messages({
      'string.empty': 'Shipping address cannot be empty',
      'any.required': 'Shipping address is required'
    }),

  city: Joi.string()
    .required()
    .messages({
      'string.empty': 'City cannot be empty',
      'any.required': 'City is required'
    }),

  state: Joi.string()
    .required()
    .messages({
      'string.empty': 'State cannot be empty',
      'any.required': 'State is required'
    }),

  paymentId: Joi.string()
    .uuid()
    .messages({
      'string.uuid': 'Payment ID must be a valid UUID'
    })
});