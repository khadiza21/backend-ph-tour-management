/* eslint-disable no-console */
import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import bcryptjs from "bcryptjs";

const createUser = async (payload: Partial<IUser>) => {

    // which data will be send there have destructure
    const { email, password, ...rest } = payload;
    console.log(email);

    const isUserExist = await User.findOne({ email });

    // business logic
    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exits");
    }
    // business logic
    const hashedPassword = await bcryptjs.hash(password as string, 10);


    console.log(password, hashedPassword);

    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }

    // here communicate with database and created data
    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider], ...rest
    })

    return user;
}

const getAllUsers = async () => {
    const users = await User.find({});

    const totalUsers = await User.countDocuments();
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }

}

export const UserServices = {
    createUser,
    getAllUsers
}