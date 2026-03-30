import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/auth.middleware";
import { asyncWrapper } from "../errors/asyncWrapper";
import { authRateLimit } from "../middlewares/rateLimit.middleware";

export const router = Router();

router.get("/auth/me", isAuthenticated, asyncWrapper(authController.getMe));
router.post("/auth/register", authRateLimit, asyncWrapper(authController.registerUser));
router.post("/auth/login", authRateLimit, asyncWrapper(authController.loginUser));
router.post("/auth/logout", isAuthenticated, asyncWrapper(authController.logoutUser));
router.post("/auth/refresh", asyncWrapper(authController.refreshUserToken));
