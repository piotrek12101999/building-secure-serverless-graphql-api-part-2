import joi from "joi";

export const schema = joi
  .object({
    products: joi.array().items(joi.string().uuid()).required(),
  })
  .required();
