import { NextFunction, Response, Request } from "express";
import * as userController from "./user/controller"
import { logError, logInfo } from "./logger";
import axios from "axios";

export async function authentication(req: Request, res: Response, next: NextFunction) {
    try {
        const bearerTokenSplit = req.headers.authorization?.split("Bearer ");
        const basicAuthSplit = req.headers.authorization?.split("Basic ");

        const api_key = req.headers?.api_key;
        const bearerToken = bearerTokenSplit && bearerTokenSplit.length > 1 ? bearerTokenSplit[1] : undefined;
        const basicBase64 = basicAuthSplit && basicAuthSplit.length > 1 ? basicAuthSplit[1] : undefined;

        if (basicBase64) {
            const decryptedBasic = Buffer.from(basicBase64, "base64").toString('ascii');
            const sliceIndex = decryptedBasic.indexOf(":");
            if (sliceIndex > 1 && sliceIndex < decryptedBasic.length) {
                const _id = decryptedBasic.slice(0, sliceIndex);
                const password = decryptedBasic.slice(sliceIndex + 1);
                req.body.user = await userController.getUserByIdPass(_id, password)
                if (req.body.user) {
                    logInfo("Valid Basic Auth!")
                    return next();
                }
            }
        }

        if (api_key) {
            const decoded: any = userController.verifyToken(api_key as string);
            console.log({ decoded })
            if (decoded) {
                req.body.user = await userController.getUserByIdEmail(decoded._id, decoded.email)
                logInfo("Valid api_key!")
                return next();
            }
        }

        if (bearerToken) {
            // custom BearerToken
            const decoded: any = userController.verifyToken(bearerToken as string);
            if (decoded) {
                req.body.user = await userController.getUserByIdEmail(decoded._id, decoded.email)
                logInfo("Valid Bearer token!")
                return next();
            }

            // Google OAuth2.0 BearerToken
            const response = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", { headers: { "Authorization": req.headers.authorization } })
                .catch(err => logError("Error occurred in authentication middleware"))
            if (response?.data) {
                logInfo("Valid Bearer token!")
                req.body.user = await userController.getUserByEmail(response.data?.email)
                console.log({ response: response.data })
                return next();
            }
        }
        return res.status(401).send("Unauthorized");
    } catch (err) {
        logError("error occurred in authentication middleware", err);
        return res.sendStatus(500);
    }
}