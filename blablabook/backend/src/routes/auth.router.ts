import { Router } from "express"; 
import * as authController from "../controllers/auth.controller"; 
import { isAuthenticated } from "../middlewares/auth.middleware";

export const router = Router(); 

router.post("/auth/register", authController.registerUser); 
router.post("/auth/login", authController.loginUser); 
router.post("/auth/logout", isAuthenticated, authController.logoutUser); 