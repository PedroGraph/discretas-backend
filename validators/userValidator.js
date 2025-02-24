import Joi from 'joi';

export const userSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email should be valid',
      'string.empty': 'Email cannot be empty',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .required()
    .messages({
      'string.min': 'Password should have at least {#limit} characters',
      'string.pattern.base': 'Password should contain at least one uppercase, one lowercase and one number',
      'string.empty': 'Password cannot be empty',
      'any.required': 'Password is required'
    }),

  firstName: Joi.string()
    .min(2)
    .max(50)
    .messages({
        'string.min': 'First name should have at least {#limit} characters',
        'string.max': 'First name cannot exceed {#limit} characters',
        'string.empty': 'First name cannot be empty'
    }),

  lastName: Joi.string()
    .min(2)
    .max(50)
    .messages({
        'string.min': 'Last name should have at least {#limit} characters',
        'string.max': 'Last name cannot exceed {#limit} characters',
        'string.empty': 'Last name cannot be empty'
    }),

  photoUrl: Joi.string()
    .uri()
    .messages({
        'string.uri': 'Photo URL should be a valid URL'
    }),

  phoneNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .messages({
        'string.pattern.base': 'Phone number should have a valid format'
    })
});

export const userUpdateSchema = Joi.object({
  email: Joi.string()
    .email()
    .messages({
        'string.email': 'Email should be valid'
    }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
        'string.min': 'Password should have at least {#limit} characters',
        'string.pattern.base': 'Password should contain at least one uppercase, one lowercase and one'
    }),

  firstName: Joi.string()
    .min(2)
    .max(50)
    .messages({
        'string.min': 'First name should have at least {#limit} characters',
        'string.max': 'First name cannot exceed {#limit} characters'
    }),

  lastName: Joi.string()
    .min(2)
    .max(50)
    .messages({
        'string.min': 'Last name should have at least {#limit} characters',
        'string.max': 'Last name cannot exceed {#limit} characters'
    }),

  photoUrl: Joi.string()
    .uri()
    .messages({
        'string.uri': 'Photo URL should be a valid URL'
    }),

  phoneNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .messages({
        'string.pattern.base': 'Phone number should have a valid format'
    })
}).min(1).messages({
    'object.min': 'At least one field must be updated'
});

export const userLoginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Email should be valid',
            'string.empty': 'Email cannot be empty',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .required()
        .messages({
            'string.min': 'Password should have at least {#limit} characters',
            'string.pattern.base': 'Password should contain at least one uppercase, one lowercase and one',
            'string.empty': 'Password cannot be empty',
            'any.required': 'Password is required'
        }),
});

export const userChangePasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .messages({
      'string.email': 'Email should be valid'
    }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .messages({
      'string.min': 'Password should have at least {#limit} characters',
      'string.pattern.base': 'Password should contain at least one uppercase, one lowercase and one'
    }),
});