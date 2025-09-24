// here have login /logout/forget pass/reset pass these api related business logic

import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface"
import httpStatus from "http-status-codes"
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
// this auth folder handle only business logic. have no connection with database
const credentialsLogin = async (payload:Partial<IUser>) => {
    const {email, password} = payload;
    const isUserExist = await User.findOne({email});

     if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exits");
    }

    const isPasswordMatched = await bcryptjs.compare(password as string , isUserExist.password as string)

      if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
    }

   // const {password, ...rest } = isUserExist;

    return {
       // ...rest
       email:isUserExist.email
    }

}

// user - login - token (email, role, _id) - booking /payment / payment cancel - token
export const AuthServices = {
    credentialsLogin
}