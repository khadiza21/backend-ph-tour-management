/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const globalErrorHandle = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = 500;
    let message = "Something Went Wrong!!from global error";

    // here err is an object and checking if err is of appError instance /grping
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    } else if (err instanceof Error) {
        statusCode = 500;
        message = err.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
        err,
        // stack basically throw the error that error which comes from which file and line. 
        stack: envVars.NODE_ENV === "development" ? err.stack : null
    })
}
// this is one kind of controller because handle the req, res