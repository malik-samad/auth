
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Router } from 'express';

const swaggerRout = Router();

const options: swaggerUi.SwaggerOptions = {
    failOnErrors: true, // Whether or not to throw when parsing errors. Defaults to false.
    apis: ["./src/apis/*"],
    definition: {
        swagger: '2.0',
        info: {
            title: 'Boilerplate APIs',
            version: '1.0.0',
            description: `This API is for public use and to practice how different authentication methods work. in this API server you will be able to perform authentication using 
             - \`Session key\`: In session we will store the token received from login endpoint.
             - [\`Basic Auth\`](https://en.wikipedia.org/wiki/Basic_access_authentication)
             - \`API key\`: The key must be \`api-key\`
             - [\`JWT Token / Bearer Token\`](https://en.wikipedia.org/wiki/JSON_Web_Token)
             - [\`OAuth 2.0\`](https://console.cloud.google.com/)
             `,
            contact: {
                email: "maliksamad.se@gamil.com",
                name: "Developer"
            },
        },
        tags: [
            {
                name: "User",
                description: "Endpoints for User",
            },
            {
                name: "Post",
                description: "Endpoints for Posts",
            },
            {
                name: "GraphQL",
                description: "Endpoints for GraphQL",
            },
        ],
        definitions: {
            Post: {
                type: "object",
                properties: {
                    postBy: { type: "string" },
                    title: { type: "string" },
                    body: { type: "string" },
                }
            },
            User: {
                type: "object",
                properties: {
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                    email: { type: "string" },
                    password: { type: "string" },
                    role: { type: "array", items: { type: "string" } },
                }
            }
        },
        securityDefinitions: {
            BasicAuth: {
                type: "basic",
                name: "Basic Authorization",
                in: "header"
            },
            Bearer: {
                type: "apiKey",
                name: "authorization",
                in: "header"
            },
            API_Key: {
                type: "apiKey",
                name: "api_key",
                in: "header"
            },
            OAuth2: {
                type: "oauth2",
                name: "OAuth2.0 Authorization",
                flow: "accessCode",
                authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
                tokenUrl: "/user/google-auth-token",//"https://oauth2.googleapis.com/token1", // 
                scopes: {
                    "https://www.googleapis.com/auth/userinfo.profile": "",
                    "https://www.googleapis.com/auth/userinfo.email": "",
                    "openid": ""
                }
            }
        },
        security: [
            {
                Bearer: [],
                BasicAuth: [],
                API_Key: [],
                OAuth2: [
                    "https://www.googleapis.com/auth/userinfo.profile",
                    "https://www.googleapis.com/auth/userinfo.email",
                    "openid"
                ]
            }
        ]
    }
};


const swaggerSpec = swaggerJsdoc(options);

// Swagger Page
swaggerRout.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default swaggerRout;
