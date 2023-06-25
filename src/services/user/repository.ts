import { logError } from "../logger";
import { UserLoginCredentials, IUser } from "./types";
import userModel from "./model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AUTH_SECRET } from "../../config";

export async function signup(user: IUser & { password: string }) {
    try {
        const result = await userModel.create(user)
        if (!result) return;

        const { password: hide, ...otherFields } = result.toObject();
        return otherFields as IUser;
    } catch (err: any) {
        logError("Error occurred in user.repository.signup()", err.message);
        if (err.message.contains("duplicate key error"))
            return { error: `Please use unique email` }
    }
}

export async function login(credentials: UserLoginCredentials & { expiryInMints?: number }) {
    try {
        const user = await userModel.findOne({ email: credentials.email })
        if (!user) return;

        const compareResult = await bcrypt.compare(credentials.password, user.password);
        if (!compareResult) return;


        const { password: hide, ...otherFields }: any = user.toObject();
        console.log("tostring Id: ", user._id.toString())
        return { user: otherFields, token: generateUserToken(user._id.toString(), user.email, credentials.expiryInMints) };
    } catch (err) {
        logError("Error occurred in user.repository.login()", err)
    }
}

export function generateUserToken(_id: string, email: string, expiryInMints?: number) {
    return jwt.sign({ _id: _id, email: email }, AUTH_SECRET as string,
        { expiresIn: expiryInMints && expiryInMints > 0 ? `${expiryInMints}m` : "10m" }) // default 10 minutes expiry
}

export async function getUser({ email, password, _id }: Partial<UserLoginCredentials> & { _id?: string }) {
    try {
        const result = await userModel.findOne({ _id });
        if (result)
            return result.toObject();

        if (!email || !password)
            return;

        return (await login({ email, password }))?.user;
    } catch (err) {
        logError("Error occurred in user.repository.getUser()", err)
    }
}


export async function getUserByEmail(email: string) {
    try {
        const user = await userModel.findOne({ email });

        if (user) {
            const { password: hide, ...otherFields } = user.toObject();
            return otherFields;
        }
    } catch (err) {
        logError("Error occurred in user.repository.getUser()", err)
    }
}


export async function getUserByIdPass(_id: string, password: string) {
    try {
        const user = await userModel.findOne({ _id })
        if (!user) return;

        const compareResult = await bcrypt.compare(password, user.password);
        if (!compareResult) return;

        const { password: hide, ...otherFields } = user.toObject();
        return otherFields;
    } catch (err) {
        logError("Error occurred in user.repository.getUser()", err)
    }
}

export async function getUserByIdEmail(_id: string, email: string) {
    try {
        const user = await userModel.findOne({ _id, email })
        if (user) {
            const { password: hide, ...otherFields } = user.toObject();
            return otherFields;
        }
    } catch (err: any) {
        logError("Error occurred in user.repository.getUser()", err.message)
        return { error: err.message }
    }
}

export async function updateUser(_id: string, update: IUser & { password: string }) {
    try {
        const user = await userModel.findOneAndUpdate({ _id }, update);
        if (!user) return;

        console.log("updateUser result: ", user);
        const { password: hide, ...otherFields } = user.toObject();
        return otherFields;
    } catch (err) {
        logError("Error occurred in user.repository.updateUser()", err)
    }
}

export async function deleteUser(_id: string) {
    try {
        const result = await userModel.deleteOne({ _id })
        console.log("Delete result: ", result);
        return result;
    } catch (err) {
        logError("Error occurred in user.repository.deleteUser()", err)
    }
}