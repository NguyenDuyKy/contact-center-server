const joi = require("joi");

const registerUserSchema = joi.object({
    email: joi.string().email().lowercase().required(),
    name: joi.string().min(1).max(30).required(),
    password: joi.string().min(8).required(),
    phone_number: joi.string().regex(/^(84|0)\d{9,10}$/).messages({
        "string.pattern.base": "Invalid phone number"
    }).required(),
    stringee_userid: joi.string().max(35)
});

const loginUserSchema = joi.object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().min(8).required()
});

const createContactSchema = joi.object({
    name: joi.string().min(1).max(30).required(),
    phone_number: joi.string().regex(/^(84|0)\d{9,10}$/).messages({
        "string.pattern.base": "Invalid phone number"
    }).required(),
    email: joi.string().email().lowercase().required(),
    gender: joi.string().valid("male", "female").required(),
    company: joi.string().min(0).max(100),
    address: joi.string().min(0).max(100),
    vip: joi.boolean().valid(true, false).required()
});

const updateContactSchema = joi.object({
    name: joi.string().min(1).max(30),
    phone_number: joi.string().regex(/^(84|0)\d{9,10}$/).messages({
        "string.pattern.base": "Invalid phone number"
    }),
    email: joi.string().email().lowercase(),
    gender: joi.string().valid("male", "female"),
    company: joi.string().min(0).max(100),
    address: joi.string().min(0).max(100),
    vip: joi.boolean().valid(true, false)
});

const recoverPasswordSchema = joi.object({
    email: joi.string().email().lowercase().required(),
    newPassword: joi.string().min(8).required(),
    otp: joi.string().regex(/^\d{5}$/).messages({
        "string.pattern.base": "Invalid OTP"
    })
});

module.exports = {
    registerUserSchema,
    loginUserSchema,
    createContactSchema,
    updateContactSchema,
    recoverPasswordSchema
}