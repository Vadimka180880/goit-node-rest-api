import Joi from "joi";

export const addContactSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().min(3).required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().trim().min(1),
  email: Joi.string().trim().email(),
  phone: Joi.string().trim().min(3),
}).min(1);

export default { addContactSchema, updateContactSchema };
