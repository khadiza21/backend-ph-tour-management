/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import httpStatus from "http-status-codes"
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

//in the catchAsync function received a function as parameter
// catchAsync is higher order function
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);
    // res.status(httpStatus.CREATED).json({
    //     message: "User created Successfully!",
    //     user
    // })
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User created Successfully!",
        data: user
    })
})

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         //throw new Error("Fake error!");
//         //throw new AppError(httpStatus.BAD_REQUEST, "fake error")
//         createUserFunction(req, res)
//     } catch (err: any) {
//         // eslint-disable-next-line no-console
//         console.log(err);
//         next(err);
//     }
// }

// get all users 
const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();
    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: "All Users Retrieved Successfully",
    //     data:users,
    // })
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "All Users Retrieved Successfully",
        data: result.data,
        meta:result.meta
    })
})


// we can use this in a route
export const UserControllers = {
    createUser,
    getAllUsers
}
// we communicate with database by controller

//api er business logic and functionality gulo and ja database er sathe connection kore ta service layer e niye kaj korte hobe
// controller handle the req , res and send the req body into service layer or call the function and send it in service layer.

// route matching --> controllers --> service --> model --> DB
// at first need to make service 