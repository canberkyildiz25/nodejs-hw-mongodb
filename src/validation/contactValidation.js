import Joi from 'joi';

const createContactSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).optional(),
  favorite: Joi.boolean().optional(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(1).optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).optional(),
  favorite: Joi.boolean().optional(),
}).min(1);

export { createContactSchema, updateContactSchema };
