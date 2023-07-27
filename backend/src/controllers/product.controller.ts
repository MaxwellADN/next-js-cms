import { before, DELETE, GET, POST, PUT, route } from "awilix-express";
import { ProductService } from "../services/product.service";
import { Request, Response } from "express";
import { HttpStatusCodeEnum } from "../enums/http-status-code.enum";
import User from "../models/user.model";
import { ProductInterface } from "../interfaces/product.interface";
import { authenticate } from "../middlewares/auth.middleware";
import Product from "../models/product.model";
import mongoose from "mongoose";
import { UploadService } from "../services/upload.service";
import { FileUtil } from "../utils/file.util";
import { PaginationInterface } from "../interfaces/pagination.interface";
import { SortDirection } from "aws-sdk/clients/quicksight";
import { PaginationUtil } from "../utils/pagination.util";

@before([authenticate])
@route('/product')
export class ProductController {

    /**
     * The constructor function is a special function that is called when a new instance of the class
     * is created. 
     * @param {ProductService} productService - ProductService - This is the service that we want to
     * inject.
     */
    constructor(private readonly productService: ProductService, private readonly uploadService: UploadService) { }

    @GET()
    /**
     * It gets all products from a tenant
     * @param {Request} req - Request - The request object
     * @param {Response} res - Response - the response object
     * @returns The result of the query is being returned.
     */
    public async getAll(req: Request, res: Response) {
        try {
            const user = await User.findById(req.params.userId);
            if (user?.tenant) {
                const pagination = PaginationUtil.GetPaginationParams(req.query, user.tenant);
                const entities = await this.productService.getAll(pagination);
                const records = await this.productService.count(user.tenant, pagination.searchTerm);
                return res.status(HttpStatusCodeEnum.OK).json({ records, results: entities });
            }
            return res.status(HttpStatusCodeEnum.NOT_FOUND).json({ message: 'Connected user not found !' });
        } catch (error) {
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({ message: error });
        }
    }

    @route('/:id')
    @GET()
    /**
     * It gets a product by id.
     * @param {Request} req - Request - This is the request object that contains the request data.
     * @param {Response} res - Response - This is the response object that will be returned to the
     * client.
     * @returns The response object.
     */
    public async get(req: Request, res: Response) {
        try {
            if (req.params.id) {
                const entity = await this.productService.getSingle(req.params.id);
                return res.status(HttpStatusCodeEnum.OK).json(entity);
            }
            return res.status(HttpStatusCodeEnum.NOT_FOUND).json({ message: 'Product not found !' });
        } catch (error) {
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({ message: error });
        }
    }

    @POST()
    /**
     * It creates a new product and assigns it to the user's tenant.
     * @param {Request} req - Request - The request object.
     * @param {Response} res - Response - The response object that will be returned to the client.
     * @returns The result of the create operation.
     */
    public async create(req: Request, res: Response) {
        try {
            const entity: ProductInterface = req.body;
            const user = await User.findById(req.params.userId);
            if (user?.tenant) {
                entity.createdBy = user;
                entity.createdAt = new Date()
                entity.tenant = user.tenant;
                const result = await Product.create(entity);
                return res.status(HttpStatusCodeEnum.CREATED).json(result);
            }
            return res.status(HttpStatusCodeEnum.NOT_FOUND).json({ message: 'Connected user not found !' });
        } catch (error) {
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({ message: error });
        }
    }

    @route('/form-data')
    @POST()
    /**
     * It creates a new product with files and assigns it to the user's tenant.
     * @param {Request} req - Request - The request object.
     * @param {Response} res - Response - The response object that will be returned to the client.
     * @returns The result of the create operation.
     */
    public async createWithFiles(req: Request, res: Response) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const files = req.files;
            const entity: ProductInterface = JSON.parse(req.body.product);
            const user = await User.findById(req.params.userId);
            const uploads = FileUtil.createUploadFiles(files);
            if (user?.tenant) {
                entity.createdBy = user;
                entity.tenant = user.tenant;
                if (files) {
                    const filesUploaded = await this.uploadService.uploadFiles(uploads);
                    entity.files = filesUploaded;
                }
                const result = await Product.create(entity);
                await session.commitTransaction();
                return res.status(HttpStatusCodeEnum.CREATED).json(result);
            }
            return res.status(HttpStatusCodeEnum.NOT_FOUND).json({ message: 'Connected user not found !' });
        } catch (error) {
            await session.abortTransaction();
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({ message: error });
        }  finally {
            await session.endSession();
        }
    }

    @route('/:id')
    @PUT()
    /**
     * It updates a product by id.
     * @param {Request} req - Request - The request object.
     * @param {Response} res - Response - The response object that will be returned to the client.
     * @returns The result of the update operation.
     */
    public async update(req: Request, res: Response) {
        try {
            const entity: ProductInterface = req.body;
            const id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(HttpStatusCodeEnum.NOT_FOUND).json({ message: 'Data not found !' });
            entity.updateAt = new Date();
            const result = await Product.findByIdAndUpdate(id, entity, { new: true });
            return res.status(HttpStatusCodeEnum.OK).json(result);
        } catch (error) {
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({ message: error });
        }
    }

    @route('/:id')
    @DELETE()
    /**
     * It deletes a product from the database by its id
     * @param {Request} req - Request - This is the request object that contains the data sent from the
     * client.
     * @param {Response} res - Response - This is the response object that will be returned to the
     * client.
     * @returns The result of the delete operation.
     */
    public async delete(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(id)) return res.status(HttpStatusCodeEnum.NOT_FOUND).json({ message: 'Data not found !' });
            const result = await Product.findByIdAndRemove(id);
            return res.status(HttpStatusCodeEnum.OK).json(result);
        } catch (error) {
            return res.status(HttpStatusCodeEnum.BAD_REQUEST).json({ message: error });
        }
    }
}