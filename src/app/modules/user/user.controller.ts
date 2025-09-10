import { Request, Response } from "express";
import { User } from "./user.model";
import httpStatus from "http-status-codes"

const createUser = async (req: Request, res: Response) => {
    try {
        // which data will be send there have destructure
        const { name, email } = req.body;
        const user = await User.create({
            name, email
        })
        res.status(httpStatus.CREATED).json({
            message: "user created successfully ", user
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.log(err);
        res.status(httpStatus.BAD_REQUEST).json({
            message: `Something Went Wrong! ${err.message}`, err
        })
    }

}

// we can use this in a route
export const UserControllers = {
    createUser
}
