import { Router } from "express";
import * as controller from "../services/post/controller"
import { logError } from "../services/logger";

const postRout = Router()


/**
 * @swagger
 * /post:
 *   post:
 *     tags:
 *      - Post
 *     description: Add a new post.
 *     parameters:
 *         - in: body
 *           name: body
 *           schema:
 *              type: object
 *              properties:
 *                  postBy:
 *                      type: string
 *                      required: true
 *                      description: the person who posted this.
 *                  title:
 *                      type: string
 *                      required: true
 *                  body:
 *                      type: string
 *                      required: true
 *     responses:
 *       '200':
 *         description: Returns a newly added post.
 */
postRout.post("/", async (req, res) => {
    try {
        const { title, body }: { title: string, body: string } = req.body;
        const result = await controller.addPost({ title, body, postBy: req.body.user._id })
        res.status(200).send(result)
    } catch (err) {
        logError("Error Occurred in post.get('/')", err);
        res.sendStatus(500)
    }
})

/**
 * @swagger
 * /post/{id}:
 *   get:
 *     tags:
 *      - Post
 *     description: Get Post by id
 *     parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           type: string
 *     responses:
 *       '200':
 *         description: Returns post object.
 */
postRout.get("/:id", async (req, res) => {
    try {
        console.log({ params: req.params, query: req.query });
        const result = await controller.getPost(req.params.id)
        res.status(200).send(result)
    } catch (err) {
        logError("Error Occurred in post.get('/')", err);
        res.sendStatus(500)
    }
})

/**
 * @swagger
 * /post/all:
 *   get:
 *     tags:
 *      - Post
 *     description: Returns paginated all posts
 *     parameters:
 *         - in: query
 *           name: pageNo
 *           type: number
 *     responses:
 *       '200':
 *         description: Returns paginated posts.
 *       '400':
 *         description: invalid input formate - pageNo value might need correcting.
 */
postRout.get("/all", async (req, res) => {
    try {
        let { pageNo }: any = req.query;
        console.log(req.params);

        pageNo = Number(pageNo)
        if (isNaN(pageNo))
            return res.status(400);

        const result = await controller.getAllPaginated(pageNo);
        res.status(200).send(result);
    } catch (err) {
        logError("Error Occurred in post.get('/all')", err);
        res.sendStatus(500)
    }
})


/**
 * @swagger
 * /post/{id}:
 *   put:
 *     tags:
 *      - Post
 *     description: update Post by ID 
 *     parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           type: string
 *     responses:
 *       '200':
 *         description: Returns updated post.
 */
postRout.put("/:id", async (req, res) => {
    try {
        const { title, body }: { title: string | undefined, body: string | undefined } = req.body;

        const result = await controller.updatePost(req.params.id, { title, body });
        res.status(200).send(result);
    } catch (err) {
        logError("Error Occurred in post.put('/:id')", err);
        res.sendStatus(500)
    }
})

/**
 * @swagger
 * /post/{id}:
 *   delete:
 *     tags:
 *      - Post
 *     description: Delete Post by ID
 *     parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           type: string
 *     responses:
 *       '200':
 *         description: Returns deleted post ID.
 */
postRout.delete("/:id", async (req, res) => {
    try {
        const result = await controller.deletePost(req.params.id);
        res.status(200).send(result);
    } catch (err) {
        logError("Error Occurred in post.delete('/:id')", err);
        res.sendStatus(500)
    }
})



export default postRout;