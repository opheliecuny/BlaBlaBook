import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { asyncWrapper } from "../errors/asyncWrapper";

export const router = Router();

router.get("/user/profile", isAuthenticated, asyncWrapper(userController.getUserProfile));
router.patch("/user/profile", isAuthenticated, asyncWrapper(userController.updateUser));
router.delete("/user", isAuthenticated, asyncWrapper(userController.deleteUser));
