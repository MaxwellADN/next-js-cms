import axios from "../configs/axios.config";
import { API_URL } from "../constants/api.constant";
import { PostInterface } from "../interfaces/post.interface";
import { PaginationResultInterface, ResultInterface } from "../interfaces/pagination-result.interface";
import { PaginationInterface } from "../interfaces/pagination.interface";

class PostService {
    private url: string =  API_URL+'/post';

    /**
     * The function retrieves a post with a specific ID using an HTTP GET request.
     * @param {string} id - The `id` parameter is a string that represents the unique identifier of a
     * post.
     * @returns a Promise that resolves to a PaginationResultInterface<PostInterface> object.
     */
    public async get(id: string): Promise<ResultInterface<PostInterface>> {
        return await axios.get(this.url+`/${id}`);
    }

    /**
     * The function creates a new post by making a POST request to a specified URL.
     * @param {PostInterface} post - The parameter "post" is of type "PostInterface".
     * @returns a Promise that resolves to a PostInterface object.
     */
    public async create(post: PostInterface): Promise<PostInterface> {
        return await axios.post(this.url, post);
    }

    /**
     * The function updates a post with the given ID using an HTTP PUT request.
     * @param {string} id - A string representing the ID of the post that needs to be updated.
     * @param {PostInterface} post - The `post` parameter is an object that represents the updated post
     * data. It should implement the `PostInterface` interface.
     * @returns a Promise that resolves to a PostInterface object.
     */
    public async update(id: string, post: PostInterface): Promise<PostInterface> {
        return await axios.put(`${this.url}/${id}`, post);
    }

    /**
     * The function deletes a post with the specified ID using an HTTP DELETE request.
     * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
     * post that needs to be deleted.
     * @returns The delete method is returning a Promise that resolves to a PostInterface object.
     */
    public async delete(id: string): Promise<PostInterface> {
        return await axios.delete(`${this.url}/${id}`);
    }

    /**
     * The `paginate` function sends a GET request to a specified URL with pagination parameters and
     * returns a promise that resolves to the result.
     * @param {PaginationInterface} pagination - The `pagination` parameter is an object that
     * implements the `PaginationInterface` interface. It contains the following properties:
     * @returns a Promise that resolves to a PaginationResultInterface<PostInterface>.
     */
    public async paginate(pagination: PaginationInterface): Promise<PaginationResultInterface<PostInterface>> { 
        return await axios.get(this.url+`?page=${
            pagination.page
        }&size=${
            pagination.pageSize
        }&searchTerm=${
            pagination.searchTerm
        }&sortDirection=${
            pagination.sortDirection
        }&sortField=${
            pagination.sortField
        }`);
    }
       
}

const postService = new PostService();
export default postService;