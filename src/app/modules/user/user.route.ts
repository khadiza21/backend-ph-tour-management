import {  Router } from "express";
import { UserControllers } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";



const router = Router();

// function definition . don't call here this controller . express will call
router.post( "/register", validateRequest(createUserZodSchema),UserControllers.createUser);
router.get("/all-users", UserControllers.getAllUsers);

export const UserRoutes = router;
