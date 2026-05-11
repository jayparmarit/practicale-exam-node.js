import Joi from "joi";

const productBaseSchema = Joi.object({
  title: Joi.string().min(3).trim().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title is required",
    "string.min": "Title must be greater than 3 characters",
  }),

  description: Joi.string().trim().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description is required",
  }),

  price: Joi.number().min(1).messages({
    "number.base": "Price must be a number",
    "number.min": "Price must be at least 1",
  }),

  category: Joi.string()
    .valid("men", "women", "shoes", "electronics", "clothes")
    .messages({
      "string.base": "Category must be a string",
      "any.only":
        "Category must be one of men, women, shoes, electronics, clothes",
    }),

  stock: Joi.number().min(0).messages({
    "number.base": "Stock must be a number",
    "number.min": "Stock cannot be negative",
  }),

  status: Joi.string().valid("Active", "Inactive").messages({
    "any.only": "Status must be either Active or Inactive",
  }),
});

export const createProductSchema = productBaseSchema.fork(
  ["title", "description", "price", "category", "stock"],
  (field) => field.required(),
);

export const updateProductSchema = productBaseSchema;

export default { productBaseSchema, createProductSchema, updateProductSchema };
