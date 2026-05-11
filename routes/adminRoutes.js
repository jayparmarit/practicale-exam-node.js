import express from "express";

import auth from "../middlewares/Auth.js";
import checkRole from "../middlewares/checkRole.js";

import userController from "../controller/userController.js";

const router = express.Router();

// router.get("/allUser", auth, checkRole("admin"), userController);

router.patch("/update/:id", auth, checkRole("admin"), userController.update);

router.delete(
  "/delete/:id",
  auth,
  checkRole("admin"),
  userController.deleteUser,
);

export default router;
