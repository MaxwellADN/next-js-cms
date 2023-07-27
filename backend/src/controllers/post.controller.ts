import { DELETE, GET, POST, PUT, before, route } from "awilix-express";
import { authenticate } from "../middlewares/auth.middleware";
import { PostService } from "../services/post.service";
import { Request, Response } from "express";
import User from "../models/user.model";
import { PaginationUtil } from "../utils/pagination.util";
import { HttpStatusCodeEnum } from "../enums/http-status-code.enum";
import { PostInterface } from "../interfaces/post.interface";
import Post from "../models/post.model";
import mongoose from "mongoose";

@before([authenticate])
@route('/post')
export class PostController {

    constructor(private readonly postService: PostService) {}

    @GET()
    /**
     * This function paginates posts based on the user's tenant and returns the paginated results along
     * with the total count of records.
     * @param {Request} req - The `req` parameter is an object representing the HTTP request made to
     * the server. It contains information such as the request method, headers, query parameters, and
     * request body.
     * @param {Response} res - The `res` parameter is the response object that is used to send the
     * response back to the client. It is an instance of the `Response` class, which is typically
     * provided by a web framework like Express.js.
     * @returns a response with a status code and a JSON object. The JSON object contains the number of
     * records and the results of the pagination.
     */
    public async paginate(req: Request, res: Response) {
        try {
            const user = await User.findById(req.params.userId);
            if (user?.tenant) {
                const pagination = PaginationUtil.GetPaginationParams(req.query, user.tenant);
                const entities = await this.postService.paginate(pagination);
                const records = await this.postService.count(pagination);
                return res.status(HttpStatusCodeEnum.OK).json({ records, results: entities });
            }
            return res.status(HttpStatusCodeEnum.NOT_FOUND).json({ message: 'Connected user not found !' });
        } catch (error) {
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({ message: error });
        }
    }

    @GET()
    @route('/:id')
    /**
     * This function handles the GET request for retrieving a single post by its ID.
     * @param {Request} req - The `req` parameter is an object representing the HTTP request received
     * by the server. It contains information such as the request method, headers, query parameters,
     * and request body.
     * @param {Response} res - The `res` parameter is the response object that is used to send the
     * response back to the client. It is an instance of the `Response` class, which is typically
     * provided by a web framework like Express.js.
     * @returns In this code snippet, the function is returning a response object with a status code
     * and a JSON object. If the `req.params.id` is provided, it will return the entity object with a
     * status code of 200 (OK). If `req.params.id` is not provided, it will return a JSON object with a
     * message indicating that the post was not found, along with a status code of
     */
    public async get(req: Request, res: Response) {
        try {
            if (req.params.id) {
                const entity = await this.postService.getSingle(req.params.id);
                return res.status(HttpStatusCodeEnum.OK).json(entity);
            }
            return res.status(HttpStatusCodeEnum.NOT_FOUND).json({ message: 'Post not found !' });
        } catch (error) {
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({ message: error });
        }
    }

    @POST()
    /**
     * This function creates a new post with the provided data and associates it with a user.
     * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to
     * the server. It contains information such as the request headers, request body, request method,
     * request URL, and other relevant details.
     * @param {Response} res - The `res` parameter is an instance of the `Response` object, which
     * represents the HTTP response that will be sent back to the client. It is used to send the
     * response data, set the status code, and perform other operations related to the response.
     * @returns a response with the status code and a JSON object. If the user is found and has a
     * tenant, it will return a response with the status code 201 (CREATED) and the created post
     * object. If the user is not found or does not have a tenant, it will return a response with the
     * status code 404 (NOT_FOUND) and a JSON object with the
     */
    public async create(req: Request, res: Response) {
        try {
            const entity: PostInterface = req.body;
            const user = await User.findById(req.params.userId);
            if (user?.tenant) {
                entity.author = user;
                entity.createdAt = new Date()
                entity.tenant = user.tenant;
                const result = await Post.create(entity);
                return res.status(HttpStatusCodeEnum.CREATED).json(result);
            }
            return res.status(HttpStatusCodeEnum.NOT_FOUND).json({ message: 'Connected user not found !' });
        } catch (error) {
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({ message: error });
        }
    }

    @route('/:id')
    @PUT()
    /**
     * The function updates a post with the given ID and returns the updated post.
     * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to
     * the server. It contains information such as the request headers, request body, request method,
     * request URL, and other relevant details.
     * @param {Response} res - The `res` parameter is the response object that is used to send the
     * response back to the client. It is an instance of the `Response` class, which is typically
     * provided by a web framework like Express.js.
     * @returns a response with the updated post object if the update is successful. If the post is not
     * found, it returns a response with a "Post not found !" message. If there is an error during the
     * update process, it returns a response with the error message.
     */
    public async update(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const entity: PostInterface = req.body;
            const result = await this.postService.updatePost(id, entity);
            return res.status(HttpStatusCodeEnum.OK).json(result);
        } catch (error) {
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({ message: error });
        }
    }

    @route('/:id')
    @DELETE()
    /**
     * The function deletes a post by its ID and returns the deleted post as a response.
     * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to
     * the server. It contains information such as the request method, headers, query parameters, and
     * request body.
     * @param {Response} res - The `res` parameter is the response object that is used to send the
     * response back to the client. It is an instance of the `Response` class, which is typically
     * provided by a web framework like Express.js.
     * @returns a response with the status code and the result of the delete operation.
     */
    public async delete(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(HttpStatusCodeEnum.NOT_FOUND).json({ message: 'Post not found !' });
            const result = await Post.findByIdAndRemove(id);
            return res.status(HttpStatusCodeEnum.OK).json(result);
        } catch (error) {
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({ message: error });
        }
    }
}   