import { logError } from "../logger";
import { IPost } from "./types";
import postModel from "./model";

export async function addPost(user: IPost) {
    try {
        const result = await postModel.create(user)
        if (!result) return;

        return { ...result, postBy: result.postBy.toHexString() } as IPost;
    } catch (err) {
        logError("Error occurred in user.repository.addPost()", err)
    }
}

export async function getPost(_id: string) {
    try {
        return postModel.findOne({ _id })
    } catch (err) {
        logError("Error occurred in user.repository.getPost()", err)
    }
}

export async function getAllPaginated(pageNo: number) {
    try {
        return postModel.findOne({})
            .limit(10)
            .skip(10 * pageNo)
    } catch (err) {
        logError("Error occurred in user.repository.getPost()", err)
    }
}

export async function updatePost(_id: string, update: Partial<IPost>) {
    try {
        const post = await postModel.findOneAndUpdate({ _id }, update)
        if (!post) return false;

        return { ...post, postBy: post.postBy.toHexString() } as IPost;
    } catch (err) {
        logError("Error occurred in user.repository.updatePost()", err)
    }
}

export async function deletePost(_id: string) {
    try {
        const result = await postModel.deleteOne({ _id })
        console.log("Delete result: ", result);
        return result;
    } catch (err) {
        logError("Error occurred in user.repository.deletePost()", err)
    }
}