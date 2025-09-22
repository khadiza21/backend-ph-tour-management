import { Router } from "express";
import { UserControllers } from "./user.controller";

const router = Router();

// function definition . don't call here this controller . express will call   
router.post("/register", UserControllers.createUser)
router.get("/all-users", UserControllers.getAllUsers)

export const UserRoutes = router;