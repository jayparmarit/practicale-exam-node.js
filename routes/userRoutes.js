import express from "express";

import userController from "../controller/userController.js";
import validate from "../middlewares/Validate.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../validators/userValidator.js";

import auth from "../middlewares/Auth.js";

const router = express.Router();

router.post(
  "/register",
  validate(createUserSchema),
  userController.register,
);

router.post("/login", userController.login);

router.get("/authLogin", auth, userController.authLogin);

router.post("/logout", auth, userController.logout);

router.post("/logoutAll", auth, userController.logoutAll);

router.patch(
  "/update",
  auth,
  validate(updateUserSchema),
  userController.update,
);

router.delete("/delete", auth, userController.deleteUser);

export default router;
