import { Router } from "express"; 
import * as authController from "../controllers/auth.controller"; 
import { isAuthenticated } from "../middlewares/auth.middleware";
import { asyncWrapper } from "../errors/asyncWrapper";

export const router = Router(); 

router.post("/auth/register", asyncWrapper(authController.registerUser)); 
router.post("/auth/login", asyncWrapper(authController.loginUser)); 
router.post("/auth/logout", isAuthenticated, asyncWrapper(authController.logoutUser)); 