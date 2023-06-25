import { Router } from "express"
import { shouldRenderGraphiQL, renderGraphiQL, getGraphQLParameters, processRequest } from "graphql-helix";
import schema from "../services/graphql/schema"
import { logError } from "../services/logger";

const graphqlRout = Router();

/**
 * @swagger
 * /graphql:
 *   get:
 *     tags:
 *      - GraphQL
 *     description: This API can be used to render GraphiQL UI on your browser.
 *     responses:
 *       '200':
 *         description: Returns HTML of GraphiQL UI.
 */
graphqlRout.get("/", async (req, res) => {
    try {
        res.send(renderGraphiQL());
    } catch (err) {
        logError("error occurred in graphQL rendering endpoint", err)
    }
})

/**
 * @swagger
 * /graphql:
 *   post:
 *     tags:
 *      - GraphQL
 *     description: This API can be used to perform CRUD operations on Posts.
 *     parameters:
 *         - in: body
 *           name: body
 *           schema:
 *              type: string
 * 
 *     responses:
 *       '200':
 *         description: Returns an object as per the operation performed.
 */
graphqlRout.post("/", async (req, res) => {
    const request = {
        body: req.body,
        headers: req.headers,
        method: req.method,
        query: req.query,
    };

    if (!shouldRenderGraphiQL(request)) {
        const { operationName, query, variables } = getGraphQLParameters(request);

        const result = await processRequest({
            operationName,
            query,
            variables,
            request,
            schema,
        });

        if (result.type === 'RESPONSE') {
            result.headers.forEach(({ name, value }) => res.setHeader(name, value));
            res.status(result.status);
            res.json(result.payload);
        } else {
            // graphql-helix also supports subscriptions and incremental delivery (i.e. @defer and @stream directives)
            // out of the box. See the repo for more complete examples that also implement those features.
        }
    }
});


export default graphqlRout;
