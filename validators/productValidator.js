import Joi from 'joi';

export const productSchema = Joi.object({
    productName: Joi.string()
        .min(3)
        .max(255)
        .required()
        .messages({
            'string.base': 'Product name must be a string',
            'string.empty': 'Product name cannot be empty',
            'string.min': 'Product name must have at least {#limit} characters',
            'string.max': 'Product name cannot exceed {#limit} characters',
            'any.required': 'Product name is required'
        }),

    productDescription: Joi.string()
        .min(3)
        .max(2000)
        .required()
        .messages({
            'string.base': 'Product description must be a string',
            'string.empty': 'Product description cannot be empty',
            'string.min': 'Product description must have at least {#limit} characters',
            'string.max': 'Product description cannot exceed {#limit} characters',
            'any.required': 'Product description is required'
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
            'string.base': 'Product category must be a string',
            'string.empty': 'Product category cannot be empty',
            'any.required': 'Product category is required'
        }),

    productQuantity: Joi.number()
        .integer()
        .min(0)
        .default(0)
        .messages({
            'number.base': 'Product quantity must be a number',
            'number.integer': 'Product quantity must be an integer',
            'number.min': 'Product quantity cannot be negative'
        }),

    productPublished: Joi.boolean()
        .default(true)
        .messages({
            'boolean.base': 'Product published must be a boolean'
        }),

    characteristics: Joi.array().items(
        Joi.object({
            color: Joi.string().required(),
            sizes: Joi.array().items(
                Joi.object({
                    size: Joi.string().required(),
                    quantity: Joi.number().integer().min(0).required()
                })
            ).required()
        })
    ).messages({
        'array.base': 'Characteristics must be an array',
        'any.required': 'Characteristics are required'
    }),

    productImages: Joi.array()
        .items(Joi.string())
        .required()
        .messages({
            'array.base': 'Product images must be an array',
            'string.base': 'Product images must be a string',
            'any.required': 'At least one product image is required'
        })
});

export const productUpdateSchema = Joi.object({
    productName: Joi.string()
        .min(3)
        .max(255),

    productDescription: Joi.string()
        .min(3)
        .max(2000),

    productPrice: Joi.number()
        .integer()
        .min(0)
        .messages({
            'number.base': 'Product price must be a number',
            'number.integer': 'Product price must be an integer',
            'number.min': 'Product price cannot be negative'
        }),

    productCategory: Joi.string(),

    productQuantity: Joi.number()
        .integer()
        .min(0),

    productPublished: Joi.boolean(),

    characteristics: Joi.array().items(
        Joi.object({
            color: Joi.string(),
            sizes: Joi.array().items(
                Joi.object({
                    size: Joi.string(),
                    quantity: Joi.number().integer().min(0)
                })
            )
        })
    ),

    productImages: Joi.array()
        .items(Joi.string())
}).min(1)
    .messages({
        'object.min': 'Se debe proporcionar al menos un campo para actualizar'
    });