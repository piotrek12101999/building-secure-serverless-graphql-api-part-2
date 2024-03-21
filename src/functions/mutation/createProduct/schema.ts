import joi from "joi";

export const schema = joi
  .object({
    name: joi.string().required(),
    description: joi.string(),
    price: joi
      .object({
        currency: joi.string().required(),
        amount: joi.number().required(),
      })
      .required(),
    categories: joi.array().items(joi.string().uuid()).required(),
  })
  .required();
