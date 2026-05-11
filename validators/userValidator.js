import Joi from "joi";

const userBaseSchema = Joi.object({
  name: Joi.string().trim().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
  }),

  email: Joi.string().email().trim().lowercase().messages({
    "string.base": "Email must be a string",
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),

  password: Joi.string().min(6).messages({
    "string.base": "Password must be a string",
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
  }),

  phone: Joi.number().min(10)
    .messages({
      "number.base": "Phone must be a number",
      "number.pattern.base": "Phone must be a valid 10-digit number",
      "number.empty": "Phone is required",
    }),

  tokens: Joi.array().items(
    Joi.object({
      token: Joi.string().required().messages({
        "string.empty": "Token cannot be empty",
      }),
    }),
  ),
});

export const createUserSchema = userBaseSchema.fork(
  ["name", "email", "password", "phone"],
  (field) => field.required(),
);

export const updateUserSchema = userBaseSchema;

export default { userBaseSchema, createUserSchema, updateUserSchema };
