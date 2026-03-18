import { Router } from "express"; 
import * as userController from "../controllers/user.controller"; 
import { isAuthenticated } from "../middlewares/auth.middleware";

export const router = Router(); 

router.patch("/user/profile", isAuthenticated, userController.updateUser); 
