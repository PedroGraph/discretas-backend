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

  productName: Joi.string()
  .required()
  .messages({
    'string.empty': 'Product name cannot be empty',
    'any.required': 'Product name is required'
  }),

  productPrice: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      'number.base': 'Product price must be a number',
      'number.integer': 'Product price must be an integer',
      'number.min': 'Product price cannot be negative',
      'any.required': 'Product price is required'
    }),

  productCategory: Joi.string()
    .required()
    .messages({
      'string.empty': 'Product category cannot be empty',
      'any.required': 'Product category is required'
    }),

    images: Joi.array()
    .items(Joi.string().uri())
    .required()
    .messages({
      'array.base': 'Product images must be an array',
      'string.base': 'Each product image must be a string',
      'any.required': 'At least one product image is required',
      'string.uri': 'Each product image must be a valid URL'
    }),
  

  size: Joi.string()
    .allow('')
    .allow(null),

  color: Joi.string()
    .allow('')
    .allow(null),

  discount: Joi.number()
    .allow(null)
    .allow('')
    .allow(0)
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