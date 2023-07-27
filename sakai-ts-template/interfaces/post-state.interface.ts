import { PostInterface } from "./post.interface";

export interface PostStateInterface {
    posts: PostInterface[];
    item?: PostInterface;
    loading: boolean;
    page: number;
    pageSize: number;
    totalRecords: number;
}
