import { Router } from "express";
import axios from "axios"
import { logError, logInfo } from "../services/logger";
import * as controller from "../services/user/controller";
import { authentication } from "../services/middleware";
import { generateUserToken } from "../services/user/repository";

const userRout = Router()

/**
 * @swagger
 * /user/:
 *   post:
 *     tags:
 *      - User
 *     description: register new user
 *     parameters:
 *         - in: body
 *           name: body
 *           schema:
 *              type: object
 *              properties:
 *                  firstName:
 *                      type: string
 *                      required: true
 *                  lastName:
 *                      type: string
 *                      required: true
 *                  email:
 *                      type: string
 *                      required: true 
 *                  password:
 *                      type: string
 *                      required: true
 *                  role:
 *                      type: array
 *                      items: 
 *                          type: string
 *     responses:
 *       '200':
 *         description: Returns a mysterious string.
 */
userRout.post("/", async (req, res) => {
    try {
        const { password, email, firstName, lastName } = req.body;
        const user = await controller.signup({ password, email, firstName, lastName })
        res.status(200).send(user)
    } catch (err) {
        logError("Error Occurred in user.post('/') ", err);
        res.sendStatus(500)
    }
})

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *      - User
 *     description: Returns Auth-Token that can be used as bearer, cookie, session, or as API-key to authorize api access. 
 *     parameters:
 *         - in: body
 *           name: body
 *           schema:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                      required: true
 *                  password:
 *                      type: string
 *                      required: true
 *                  expiryInMints:
 *                      type: number
 *     responses:
 *       '200':
 *         description: Returns user object data.
 */
userRout.post("/login", async (req, res) => {
    try {
        const { password, email, expiryInMints }: { password: string, email: string, expiryInMints?: number } = req.body;
        const authToken = await controller.login({ password, email, expiryInMints })
        res.status(200).send(authToken)
    } catch (err) {
        logError("Error Occurred in user.get('/login')", err);
        res.sendStatus(500)
    }
})

/**
 * @swagger
 * /user/google-auth-token:
 *   post:
 *     tags:
 *      - User
 *     description: Returns Auth Token for the given redirect url params of Consent screen.
 *     consumes:
 *         - text/plain
 *     parameters:
 *         - in: body
 *           name: body
 *           required: true
 *           schema:
 *              type: string
 *     responses:
 *       '200':
 *         description: Returns deleted user ID.
 */
userRout.post("/google-auth-token", async (req, res) => {
    try {
        const options = {
            method: 'POST',
            data: req.body,
            url: "https://oauth2.googleapis.com/token",
        };
        const result = await axios(options).catch(err => console.log(err.response))
        if (!result)
            throw new Error("Error occurred in verifying token")

        const userInfo = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", { headers: { "Authorization": `Bearer ${result?.data.access_token}` } })
            .catch(err => logError("error occurred in authentication middleware", err))

        if (userInfo?.data) {
            const { email, given_name, family_name }: { email: string, given_name: string, family_name: string } = userInfo.data;
            const existingUser = await controller.getUserByEmail(email);
            console.log({ existingUser })
            if (existingUser)
                return res.send({ ...result?.data, UserBearerToken: generateUserToken(existingUser._id.toString(), existingUser.email), user: existingUser });

            const { error, ...newUser }: any = await controller.signup({
                email,
                password: (Math.random() + 1).toString(36),
                firstName: given_name,
                lastName: family_name,
                isGoogleAuth: true
            })
            console.log({ newUser, error })

            if (newUser && !error)
                return res.send({ ...result?.data, UserBearerToken: generateUserToken(newUser._id.toString(), newUser.email), user: newUser });
        }

        res.status(401).send("Unauthorized")
    } catch (err) {
        logError("Error Occurred in user.post('/google-auth-token')", err);
        res.sendStatus(500)
    }
})


// Secured Endpoints Starts here
userRout.use(authentication)

/**
 * @swagger
 * /user/:
 *   get:
 *     tags:
 *      - User
 *     description: returns user data for the user authentication details sent to it.
 *     responses:
 *       '200':
 *         description: Returns user object data.
 */
userRout.get("/", async (req, res) => {
    try {
        return res.send(req.body.user);
    } catch (err) {
        logError("Error Occurred in user.get('/')", err);
        res.sendStatus(500)
    }
})

/**
 * @swagger
 * /user/:
 *   put:
 *     tags:
 *      - User
 *     description: Updates user data for the user authentication details sent to it.
 *     parameters:
 *         - in: body
 *           name: body
 *           schema:
 *              type: object
 *              properties:
 *                  firstName:
 *                      type: string
 *                  lastName:
 *                      type: string
 *                  email:
 *                      type: string 
 *                  password:
 *                      type: string
 *                  role:
 *                      type: array
 *                      items: 
 *                          type: string
 *     responses:
 *       '200':
 *         description: Returns updated user object data.
 */
userRout.put("/", (req, res) => {
    try {
        const { email, firstName, lastName, password, role } = req.body;

        if (req.body.user._id)
            return res.send(controller.updateUser(req.body.user._id.toString(), { email, firstName, lastName, password, role }));

        res.status(401).send("Unauthorized");
    } catch (err) {
        logError("Error Occurred in user.put('/')", err);
        res.sendStatus(500)
    }
})

/**
 * @swagger
 * /user/:
 *   delete:
 *     tags:
 *      - User
 *     description: Deletes user data for the user authentication details sent to it.
 *     responses:
 *       '200':
 *         description: Returns deleted user ID.
 */
userRout.delete("/", (req, res) => {
    try {
        if (req.body.user._id)
            return res.send(controller.deleteUser(req.body.user._id.toString()));
        res.status(401).send("Unauthorized");
    } catch (err) {
        logError("Error Occurred in user.put('/')", err);
        res.sendStatus(500)
    }
})



export default userRout;
