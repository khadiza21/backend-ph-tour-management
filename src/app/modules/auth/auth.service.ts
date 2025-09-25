// here have login /logout/forget pass/reset pass these api related business logic

import AppError from "../../errorHelpers/AppError";
import { IsActive, IUser } from "../user/user.interface"
import httpStatus from "http-status-codes"
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { createUserTokens } from "../../utils/userTokens";
import { generateToken, verifyToken } from "../../utils/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
// this auth folder handle only business logic. have no connection with database
const credentialsLogin = async (payload: Partial<IUser>) => {
    const { email, password } = payload;
    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not Exits");
    }

    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect Password");
    }


    // const jwtPayload = {
    //     userId: isUserExist._id,
    //     email:isUserExist.email,
    //     role:isUserExist.role
    // }
    // const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    // const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

    const usrTokens = createUserTokens(isUserExist)
    // delete isUserExist.password;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: pass, ...rest } = isUserExist.toObject();

    // const {password, ...rest } = isUserExist;

    return {
        // ...rest
        // email: isUserExist.email
        accessToken: usrTokens.accessToken,
        refreshToken: usrTokens.refreshToken,
        user: rest
    }

}
const getNewAccessToken = async (refreshToken: string) => {
    // validate refresh token
    const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;

    // getting user
    const isUserExist = await User.findOne({ email: verifiedRefreshToken.email });

    // validate user
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exits");
    }
    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`);
    }
    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted.");
    }

    // send new token to user
    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }
    const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

    return {
        accessToken
    }

}

// user - login - token (email, role, _id) - booking /payment / payment cancel - token
export const AuthServices = {
    credentialsLogin,
    getNewAccessToken
}