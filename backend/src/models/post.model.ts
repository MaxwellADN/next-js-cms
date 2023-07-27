import mongoose, { Schema, model } from "mongoose";
import { PostInterface } from "../interfaces/post.interface";

export const PostSchema = new Schema({
    createdAt: { 
        type: Date,
        default: new Date(),
    },
    updatedAt: { 
        type: Date,
        default: null,
    },
    name: { 
        type: String,
        required: true
    },
    description: { 
        type: String,
        required: false
    },
    content: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    tags: [],
    comments: [],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true
    }
});

const Post = model<PostInterface>('Post', PostSchema);
export default Post;