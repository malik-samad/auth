import { Schema, model } from "mongoose"

const PostSchema = new Schema({
    postBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    title: { type: String, required: true },
    body: { type: String, required: true },
}, { timestamps: true })


export default model("Post", PostSchema);