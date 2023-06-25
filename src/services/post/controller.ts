import { logError } from "../logger";
import { IPost } from "./types";
import * as repository from "./repository"

export async function addPost(post: IPost) {
    try {
        return repository.addPost(post)
    } catch (err) {
        logError("Error occurred in post.controller.addPost()", err)
    }
}

export async function getPost(_id: string) {
    try {
        return repository.getPost(_id)
    } catch (err) {
        logError("Error occurred in post.controller.getPost()", err)
    }
}

export async function getAllPaginated(pageNo: number) {
    try {
        return repository.getAllPaginated(pageNo)
    } catch (err) {
        logError("Error occurred in post.controller.getAllPaginated()", err)
    }
}

export async function updatePost(_id: string, update: Partial<IPost>) {
    try {
        return repository.updatePost(_id, update)
    } catch (err) {
        logError("Error occurred in post.controller.updatePost()", err)
    }
}

export async function deletePost(_id: string) {
    try {
        return repository.deletePost(_id)
    } catch (err) {
        logError("Error occurred in post.controller.deletePost()", err)
    }
}