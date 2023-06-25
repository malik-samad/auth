export type UserLoginCredentials = {
    email: string;
    password: string;
}

export interface IUser {
    firstName: string,
    lastName: string,
    email: string,
    emailVerified?: Boolean,
    isGoogleAuth?: Boolean,
    role?: string[]
}