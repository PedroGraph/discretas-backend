import Joi from 'joi';

const notificationTypes = ['SMS', 'EMAIL', null];

export const notificationSchema = Joi.object({
  specialOffers: Joi.string()
    .valid(...notificationTypes)
    .messages({
      'any.only': 'Special offers notification type must be SMS, EMAIL, or null',
      'string.base': 'Special offers notification type must be a string'
    }),

  newCollections: Joi.string()
    .valid(...notificationTypes)
    .messages({
      'any.only': 'New collections notification type must be SMS, EMAIL, or null',
      'string.base': 'New collections notification type must be a string'
    }),

  shoppingCartReminder: Joi.string()
    .valid(...notificationTypes)
    .messages({
      'any.only': 'Shopping cart reminder notification type must be SMS, EMAIL, or null',
      'string.base': 'Shopping cart reminder notification type must be a string'
    }),

  userId: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.uuid': 'User ID must be a valid UUID',
      'string.empty': 'User ID cannot be empty',
      'any.required': 'User ID is required'
    })
});

export const notificationUpdateSchema = Joi.object({
  specialOffers: Joi.string()
    .valid(...notificationTypes)
    .messages({
      'any.only': 'Special offers notification type must be SMS, EMAIL, or null',
      'string.base': 'Special offers notification type must be a string'
    }),

  newCollections: Joi.string()
    .valid(...notificationTypes)
    .messages({
      'any.only': 'New collections notification type must be SMS, EMAIL, or null',
      'string.base': 'New collections notification type must be a string'
    }),

  shoppingCartReminder: Joi.string()
    .valid(...notificationTypes)
    .messages({
      'any.only': 'Shopping cart reminder notification type must be SMS, EMAIL, or null',
      'string.base': 'Shopping cart reminder notification type must be a string'
    })
}).min(1).messages({
  'object.min': 'At least one notification preference must be provided for update'
});