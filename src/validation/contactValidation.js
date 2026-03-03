import Joi from 'joi';

const contactTypeSchema = Joi.string().valid('work', 'home', 'personal');

const createContactSchema = Joi.object({
  name: Joi.string().min(1).required(),
  phoneNumber: Joi.string().pattern(/^[0-9+\-\s()]+$/).required(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: contactTypeSchema.optional(),
});

const updateContactSchema = Joi.object({
  name: Joi.string().min(1).optional(),
  phoneNumber: Joi.string().pattern(/^[0-9+\-\s()]+$/).optional(),
  email: Joi.string().email().optional(),
  isFavourite: Joi.boolean().optional(),
  contactType: contactTypeSchema.optional(),
}).min(1);

export { createContactSchema, updateContactSchema };
