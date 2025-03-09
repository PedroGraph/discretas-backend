import Joi from 'joi';

export const addressSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.min': 'Name must be at least 3 characters long',
      'string.max': 'Name cannot exceed 100 characters',
      'string.empty': 'Name cannot be empty',
      'any.required': 'Name is required'
    }),

  street: Joi.string()
    .min(5)
    .max(200)
    .required()
    .messages({
      'string.min': 'Street address must be at least 5 characters long',
      'string.max': 'Street address cannot exceed 200 characters',
      'string.empty': 'Street address cannot be empty',
      'any.required': 'Street address is required'
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

  zip: Joi.string()
    .pattern(/^\d{6}(-\d{4})?$/)
    .required()
    .messages({
      'string.pattern.base': 'ZIP code must be in format 12345 or 12345-6789',
      'string.empty': 'ZIP code cannot be empty',
      'any.required': 'ZIP code is required'
    }),

  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be in a valid format',
      'string.empty': 'Phone number cannot be empty',
      'any.required': 'Phone number is required'
    }),

  indications: Joi.string()
    .max(500)
    .allow('')
    .messages({
      'string.max': 'Additional indications cannot exceed 500 characters'
    }),

  property: Joi.string()
    .valid('hogar', 'apartamento')
    .required()
    .messages({
      'any.only': 'Property type must be either "hogar" or "apartamento"',
      'any.required': 'Property type is required'
    }),

  default: Joi.boolean()
    .default(false)
    .messages({
      'boolean.base': 'Default must be a boolean value'
    })
});

export const addressUpdateSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .messages({
      'string.min': 'Name must be at least 3 characters long',
      'string.max': 'Name cannot exceed 100 characters'
    }),

  street: Joi.string()
    .min(5)
    .max(200)
    .messages({
      'string.min': 'Street address must be at least 5 characters long',
      'string.max': 'Street address cannot exceed 200 characters'
    }),

  city: Joi.string(),
  state: Joi.string(),

  zip: Joi.string()
    .pattern(/^\d{5}(-\d{4})?$/)
    .messages({
      'string.pattern.base': 'ZIP code must be in format 12345 or 12345-6789'
    }),

  phone: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .messages({
      'string.pattern.base': 'Phone number must be in a valid format'
    }),

  indications: Joi.string()
    .max(500)
    .allow('')
    .messages({
      'string.max': 'Additional indications cannot exceed 500 characters'
    }),

  property: Joi.string()
    .valid('hogar', 'apartamento')
    .messages({
      'any.only': 'Property type must be either "hogar" or "apartamento"'
    }),

  default: Joi.boolean()
    .messages({
      'boolean.base': 'Default must be a boolean value'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});