import express from "express"

import graphqlRout from "./apis/graphql.api";
import userRout from "./apis/user.api";
import postRout from "./apis/post.api";
import swaggerRout from "./apis/docs";
import { logError } from "./services/logger";
import mongoose from "mongoose";
import { MONGO_CONNECTION_STRING } from "./config";
import { authentication } from "./services/middleware";

process.on("uncaughtException", (err, origin) => {
    console.log(logError(`${err.message} - unhandled error at - ${origin}`))
}).on("unhandledRejection", (reason, p) => {

    console.log(logError(`${reason} - unhandled rejection of promise - ${p}`))
})

mongoose.set("returnOriginal", false);
mongoose.set("toJSON", { virtuals: true });
mongoose.set("toObject", { virtuals: true });
mongoose.connection.on("open", () => console.log("Mongoose connection Success!"))
    .on('error', err => logError(err));
mongoose.connect(MONGO_CONNECTION_STRING);

const app = express();
app.disable('x-powered-by');

// middleware
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded());

// Add api routs to the app
app.use("/user", userRout)
app.use("/doc", swaggerRout)

app.use("/graphql", authentication, graphqlRout)
app.use("/post", authentication, postRout)
app.use("*", (req, res) => {
    res.redirect("/doc/")
})
export default app;
