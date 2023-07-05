import { IS_DEVELOPMENT, PORT } from "./config"
import express from 'express'

// lambda.js
const serverlessExpress = require('@vendia/serverless-express')
const app = require('./server')

exports.handler = serverlessExpress({ app })

if (IS_DEVELOPMENT)
    express()
        .use(app)
        .listen(parseInt(PORT) || 5000, () => console.log(`Server running on port ${PORT}`));
