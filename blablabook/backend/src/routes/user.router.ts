import { Router } from "express"; 
import * as userController from "../controllers/user.controller.ts"; 

export const router = Router(); 

router.patch("/user/profile", userController.updateUser); 
