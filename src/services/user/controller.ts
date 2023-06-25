import { logError, logInfo } from "../logger";
import { UserLoginCredentials, IUser } from "./types";
import * as repository from "./repository"
import jwt from "jsonwebtoken";
import { AUTH_SECRET } from "../../config";

export async function signup(user: IUser & { password: string }) {
    try {
        return repository.signup(user)
    } catch (err) {
        logError("Error occurred in user.controller.signup()", err)
    }
}

export async function getUserByEmail(email: string) {
    try {
        return repository.getUserByEmail(email)
    } catch (err) {
        logError("Error occurred in user.controller.getUserByEmail()", err)
    }
}


export async function getUserByIdEmail(_id: string, email: string) {
    try {
        return repository.getUserByIdEmail(_id, email)
    } catch (err) {
        logError("Error occurred in user.controller.getUserByIdEmail()", err)
    }
}

export async function getUserByIdPass(_id: string, password: string) {
    try {
        return repository.getUserByIdPass(_id, password)
    } catch (err) {
        logError("Error occurred in user.controller.getUserByIdPass()", err)
    }
}
export async function login(credentials: UserLoginCredentials & { expiryInMints?: number }) {
    try {
        return repository.login(credentials)
    } catch (err) {
        logError("Error occurred in user.controller.login()", err)
    }
}

export async function getUser(query: Partial<UserLoginCredentials>) {
    try {
        return repository.getUser(query)
    } catch (err) {
        logError("Error occurred in user.controller.getUser()", err)
    }
}

export async function updateUser(_id: string, update: IUser & { password: string }) {
    try {
        return repository.updateUser(_id, update)
    } catch (err) {
        logError("Error occurred in user.controller.updateUser()", err)
    }
}

export async function deleteUser(_id: string) {
    try {
        return repository.deleteUser(_id)
    } catch (err) {
        logError("Error occurred in user.controller.deleteUser()", err)
    }
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, AUTH_SECRET as string);
    } catch (err) {
        logInfo("error Occurred while verifying token in verifyToken()", err)
    }
}