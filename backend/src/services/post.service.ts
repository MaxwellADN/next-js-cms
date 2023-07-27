import mongoose from "mongoose";
import { PaginationInterface } from "../interfaces/pagination.interface";
import { PostInterface } from "../interfaces/post.interface";
import { TenantInterface } from "../interfaces/tenant.interface";
import Post from "../models/post.model";

export class PostService {

    public async updatePost(id: string, entity: PostInterface): Promise<PostInterface | null> {
        entity.updateAt = new Date();
        entity.author = entity.author.id;
        entity.tenant = entity.tenant.id;
        return await Post.findByIdAndUpdate(id, entity, { new: true });
    }

    /**
     * The function `getSingle` retrieves a single post by its ID, populates the author field, and
     * returns it as a Promise.
     * @param {string} id - The `id` parameter is a string that represents the unique identifier of a
     * post.
     * @returns a Promise that resolves to either a PostInterface object or null.
     */
    public async getSingle(id: string): Promise<PostInterface | null> {
        return await Post.findById(id)
            .populate('author')
            .exec()
    }

    /**
     * The `paginate` function retrieves a list of posts based on the provided pagination interface,
     * including search term, sort field, sort direction, and tenant ID.
     * @param {PaginationInterface} pagination - The `paginationInterface` is an object that
     * contains the parameters for pagination and filtering. It has the following properties:
     * @returns a Promise that resolves to an array of PostInterface objects or null.
     */
    public async paginate(pagination: PaginationInterface): Promise<PostInterface[] | null> {
        const regex = new RegExp(pagination.searchTerm, 'i'); // the regex is for the search
        let sort: any = { createdAt: -1 }; // this line sort by createdAt field desc
        if (pagination.sortDirection !== '') {
            sort = { [pagination.sortField]: pagination.sortDirection === 'asc' ? -1 : 1 };
        }
        return await Post
            .find({
                $and: [ // ==> combine condition (&&)
                    { tenant: pagination.tenantId }, // 1st condition: filter by tenantId
                    { // 2e condition
                        $or: [ // chooose between following condition
                            { name: { $regex: regex }}, // search in name
                            { description: { $regex: regex }}, // search in description
                            { content: { $regex: regex }},
                            { state: { $regex: regex }},
                        ]
                    }
                ]
            })
            .skip(pagination.skip)
            .limit(pagination.size)
            .sort(sort)
            .exec()
    }

    /**
     * The count function returns the number of posts that match the given pagination criteria,
     * including searching for a specific term in multiple fields. This function will be use for pagination
     * @param {PaginationInterface} pagination - The pagination parameter is an object that contains
     * the following properties:
     * @returns The count of posts that match the given pagination criteria.
     */
    public async count(pagination: PaginationInterface): Promise<number | null>{
        const regex = new RegExp(pagination.searchTerm, 'i'); 
        return await Post.count({
            $and: [ // ==> combine condition (&&)
                { tenant: pagination.tenantId }, // 1st condition: filter by tenantId
                { // 2e condition
                    $or: [ // chooose between following condition
                        { name: { $regex: regex }}, // search in name
                        { description: { $regex: regex }}, // search in description
                        { content: { $regex: regex }},
                        { state: { $regex: regex }},
                    ]
                }
            ]
        })
    }

    /**
     * The function creates a new post and returns it, or returns null if the creation fails.
     * @param {PostInterface} post - The parameter "post" is of type "PostInterface", which is an
     * interface representing the structure of a post object.
     * @returns a Promise that resolves to either a PostInterface object or null.
     */
    public async create(post: PostInterface): Promise<PostInterface | null> {
        return await Post.create(post);
    }

    /**
     * The function deletes a post with the specified ID.
     * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
     * post that needs to be deleted.
     * @returns a promise that resolves to the result of deleting one document from the "Post"
     * collection in the database, based on the provided id.
     */
    public async delete(id: string) {
        return await Post.deleteOne({ _id: id });
    }
}