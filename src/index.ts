import { IS_DEVELOPMENT, PORT } from "./config"
import express from 'express'
import app from './server'

if (IS_DEVELOPMENT)
    express()
        .use(app)
        .listen(parseInt(PORT) || 5000, () => console.log(`Server running on port ${PORT}`));

// lambda.js
const serverless = require('serverless-http');

let serverlessExpressInstance = serverless(app, { provider: "aws" });

function handler(context: any, req: any) {
    try {
        console.log({ context, req })
        return serverlessExpressInstance(context, req)
    } catch (err) {
        console.log("Error occurred, ", err);
        return { body: "Internal Server Error", status: 500 }
    }
}

exports.handler = handler