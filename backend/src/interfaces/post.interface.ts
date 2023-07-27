import { Document } from "mongoose";
import { CommentInterface } from "./comment.interface";
import { TenantInterface } from "./tenant.interface";
import { UserInterface } from "./user.interface";

export interface PostInterface extends Document {
    createdAt: Date;
    updateAt?: Date;
    name: string;
    description: string;
    content: string;
    url: string;
    state: string;
    tags: string[];
    comments: CommentInterface[];
    author: UserInterface;
    tenant: TenantInterface,
}