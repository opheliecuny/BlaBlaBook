import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";

export const router = Router();

router.get("/user/profile", isAuthenticated, userController.getUserProfile);
router.patch("/user/profile", isAuthenticated, userController.updateUser);
router.delete("/user", isAuthenticated, userController.deleteUser);
