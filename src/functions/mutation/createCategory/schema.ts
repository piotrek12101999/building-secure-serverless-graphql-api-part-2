import joi from "joi";

export const schema = joi
  .object({
    name: joi.string().required(),
    products: joi.array().items(joi.string().uuid()).required(),
  })
  .required();
