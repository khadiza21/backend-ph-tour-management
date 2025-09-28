/* eslint-disable @typescript-eslint/no-non-null-assertion */
// here have login /logout/forget pass/reset pass these api related business logic

import AppError from "../../errorHelpers/AppError";
import { IUser } from "../user/user.interface"
import httpStatus from "http-status-codes"
import { User } from "../user/user.model";
import bcryptjs from "bcryptjs";
import { createNewAccessTokenWithRefreshToken, createUserTokens } from "../../utils/userTokens";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";


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
  const newAccessToken =await createNewAccessTokenWithRefreshToken(refreshToken);

  return {accessToken :newAccessToken}
}

const resetPassword = async (oldPassword: string,newPassword: string, decodedToken:JwtPayload) => {

const user = await User.findById(decodedToken.userId)
const isOldPasswordMatch = await bcryptjs.compare(oldPassword, user!.password as string);
if(!isOldPasswordMatch){
    throw new AppError(httpStatus.UNAUTHORIZED, "Old Password does not match!")
}

user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND));

user!.save();

}

// user - login - token (email, role, _id) - booking /payment / payment cancel - token
export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword
}